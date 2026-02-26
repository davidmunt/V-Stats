import uuid
from datetime import datetime
from typing import Any
from sqlalchemy import func
from app.domain.services.action import IActionService
from app.domain.repositories.action import IActionRepository
from app.domain.repositories.set import ISetRepository
from app.domain.repositories.match import IMatchRepository
from app.domain.repositories.team import ITeamRepository
from app.domain.repositories.player import IPlayerRepository
from app.domain.repositories.lineup import ILineupRepository
from app.infrastructure.models.action import Action

class ActionService(IActionService):
    def __init__(
        self,
        action_repo: IActionRepository,
        set_repo: ISetRepository,
        match_repo: IMatchRepository,
        team_repo: ITeamRepository,
        player_repo: IPlayerRepository,
        lineup_repo: ILineupRepository
    ):
        self._action_repo = action_repo
        self._set_repo = set_repo
        self._match_repo = match_repo
        self._team_repo = team_repo
        self._player_repo = player_repo
        self._lineup_repo = lineup_repo

    async def create_action(self, session, set_slug: str, data: dict, role: str) -> dict:
        if role.lower() != "analyst":
            raise PermissionError("Solo los analistas pueden registrar acciones.")

        current_set = await self._set_repo.get_by_slug_model(session, set_slug)
        if not current_set: raise ValueError("SET_NOT_FOUND")
        
        match = await self._match_repo.get_model_by_slug(session, current_set.match.slug)
        if match.status == "finished": raise ValueError("MATCH_ALREADY_FINISHED")

        team_dto = await self._team_repo.get_by_slug(session, data['slug_team'])
        player_dto = await self._player_repo.get_by_slug(session, data['slug_player'])
        
        if not team_dto or not player_dto:
            raise ValueError("TEAM_OR_PLAYER_NOT_FOUND")

        point_team_id = None
        result_symbol = data.get('result')
        
        if result_symbol == "++":
            point_team_id = team_dto.id_team
        elif result_symbol == "--":
            point_team_id = match.id_visitor_team if team_dto.id_team == match.id_local_team else match.id_local_team
        
        if data.get('slug_point_for_team'):
            pt_dto = await self._team_repo.get_by_slug(session, data['slug_point_for_team'])
            point_team_id = pt_dto.id_team

        new_action = Action(
            slug=f"act-{uuid.uuid4().hex[:8]}",
            id_match=match.id_match,
            id_set=current_set.id_set,
            id_team=team_dto.id_team,
            id_player=player_dto.id_player,
            id_point_for_team=point_team_id,
            player_position=data.get('player_position'),
            action_type=data['action_type'],
            result=result_symbol,
            start_x=data.get('start_x', 0),
            start_y=data.get('start_y', 0),
            end_x=data.get('end_x', 0),
            end_y=data.get('end_y', 0)
        )
        
        action_dto = await self._action_repo.create(session, new_action)

        result_payload = {"action": action_dto, "match_finished": False, "new_set": None}
        
        if point_team_id:
            await self._handle_rotation(session, current_set, point_team_id, match.id_match)
            await self._update_score(session, current_set, match, point_team_id, result_payload)

        return result_payload

    async def _handle_rotation(self, session, current_set, point_team_id, match_id):
        last_point = await self._action_repo.get_last_point_action(session, current_set.id_set)
        
        if last_point and last_point.id_point_for_team != point_team_id:
            lineup = await self._lineup_repo.get_active_lineup_by_team_and_match(session, match_id, point_team_id)
            if lineup:
                positions = await self._lineup_repo.get_court_positions(session, lineup.id_lineup)
                rotation_map = {1: 6, 6: 5, 5: 4, 4: 3, 3: 2, 2: 1}
                for pos in positions:
                    new_pos = rotation_map.get(pos.current_position)
                    if new_pos: 
                        await self._lineup_repo.update_position(session, pos, new_pos)

    async def _update_score(self, session, current_set, match, point_team_id, payload):
        if point_team_id == match.id_local_team:
            current_set.local_points += 1
        else:
            current_set.visitor_points += 1
        
        await session.flush()

        limit = 15 if current_set.set_number == 5 else 25
        pts_local = current_set.local_points
        pts_visitor = current_set.visitor_points
        diff = abs(pts_local - pts_visitor)

        if (pts_local >= limit or pts_visitor >= limit) and diff >= 2:
            current_set.status = "finished"
            current_set.finished_at = datetime.now()
            
            finished_sets = await self._set_repo.get_finished_sets_by_match_slug(session, match.slug)
            
            local_sets = sum(1 for s in finished_sets if s.local_points > s.visitor_points)
            visitor_sets = sum(1 for s in finished_sets if s.local_points < s.visitor_points)
            
            if pts_local > pts_visitor: local_sets += 1
            else: visitor_sets += 1

            if local_sets == 3 or visitor_sets == 3:
                match.status = "finished"
                payload["match_finished"] = True
            else:
                next_num = current_set.set_number + 1
                new_set_dto = await self._set_repo.create_next_set(session, match.id_match, next_num)
                payload["new_set"] = new_set_dto

    async def make_substitution(
        self, 
        session: Any, 
        slug_lineup: str, 
        slug_player_out: str, 
        slug_player_in: str, 
        role: str
    ) -> bool:
        if role.lower() != "analyst":
            raise PermissionError("Solo los analistas pueden realizar cambios.")

        lineup = await self._lineup_repo.get_by_slug_model(session, slug_lineup)
        if not lineup:
            raise ValueError("LINEUP_NOT_FOUND")

        pos_out = await self._lineup_repo.get_position_by_player_slug(session, lineup.id_lineup, slug_player_out)
        pos_in = await self._lineup_repo.get_position_by_player_slug(session, lineup.id_lineup, slug_player_in)

        if not pos_out or not pos_in:
            raise ValueError("PLAYER_POSITION_NOT_FOUND_IN_LINEUP")

        if not (1 <= pos_out.current_position <= 6):
            raise ValueError(f"El jugador a sustituir no está en pista (Posición actual: {pos_out.current_position})")

        if pos_in.current_position != 7:
            raise ValueError(f"El jugador entrante ya está en pista o no es elegible (Posición actual: {pos_in.current_position})")

        await self._lineup_repo.execute_substitution(session, pos_out, pos_in)

        return True

    async def delete_last_team_point(self, session: Any, set_slug: str, team_slug: str, role: str) -> bool:
        if role.lower() != "analyst":
            raise PermissionError("Solo los analistas pueden modificar el marcador.")

        current_set = await self._set_repo.get_by_slug_model(session, set_slug)
        if not current_set:
            raise ValueError("SET_NOT_FOUND")
            
        if current_set.status == "finished":
            raise ValueError("No se pueden borrar puntos de un set finalizado.")

        team = await self._team_repo.get_by_slug(session, team_slug)
        if not team:
            raise ValueError("TEAM_NOT_FOUND")

        last_action = await self._action_repo.get_last_point_by_team(
            session, current_set.id_set, team.id_team
        )

        if not last_action:
            raise ValueError("No se encontraron acciones de punto para este equipo en el set actual.")

        match = current_set.match
        is_local = team.id_team == match.id_local_team
        await self._set_repo.subtract_point(session, current_set, is_local)
        await self._action_repo.delete(session, last_action)

        return True