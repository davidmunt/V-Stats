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
from app.domain.repositories.analyst import IAnalystRepository
from app.domain.repositories.coach import ICoachRepository
from app.domain.repositories.lineup import ILineupRepository
from app.infrastructure.models.action import Action
from app.infrastructure.mappers.action import ActionModelMapper
from app.domain.dtos.action import (
    ActionDTO,
    ActionStatDTO,
    ActionGeneralStatsDTO,
    TeamActionResultBreakdownDTO,
    PlayerActionResultBreakdownDTO,
    TeamActionResultBreakdownByMatchDTO,
    PlayerActionResultBreakdownByMatchDTO,
)

class ActionService(IActionService):
    def __init__(
        self,
        action_repo: IActionRepository,
        set_repo: ISetRepository,
        match_repo: IMatchRepository,
        team_repo: ITeamRepository,
        player_repo: IPlayerRepository,
        analyst_repo: IAnalystRepository,
        coach_repo: ICoachRepository,
        lineup_repo: ILineupRepository
    ):
        self._action_repo = action_repo
        self._set_repo = set_repo
        self._match_repo = match_repo
        self._team_repo = team_repo
        self._player_repo = player_repo
        self._analyst_repo = analyst_repo
        self._coach_repo = coach_repo
        self._lineup_repo = lineup_repo

    async def create_action(self, session, set_slug: str, data: dict, role: str, user_email: str) -> dict:
        if role.lower() != "analyst":
            raise PermissionError("Solo los analistas pueden registrar acciones.")

        current_set = await self._set_repo.get_by_slug_model(session, set_slug)
        if not current_set: 
            raise ValueError("SET_NOT_FOUND")
        
        match = await self._match_repo.get_model_by_slug(session, current_set.match.slug)
        if match.status == "finished": 
            raise ValueError("MATCH_ALREADY_FINISHED")

        team_dto = await self._team_repo.get_by_slug(session, data['slug_team'])

        analyst = await self._analyst_repo.get_by_email(session, user_email)
        if not analyst:
            raise ValueError("ANALYST_NOT_FOUND")

        player_id = None
        if data.get('slug_player'):
            player_dto = await self._player_repo.get_by_slug(session, data['slug_player'])
            if player_dto:
                player_id = player_dto.id_player

        point_team_id = None
        result_symbol = data.get('result') 
        
        if data['action_type'] == "POINT_ADJUSTMENT":
            result_symbol = "++" 
            if data.get('slug_point_for_team'):
                pt_dto = await self._team_repo.get_by_slug(session, data['slug_point_for_team'])
                point_team_id = pt_dto.id_team
        else:
            if result_symbol == "++":
                point_team_id = team_dto.id_team
            elif result_symbol == "--":
                point_team_id = match.id_visitor_team if team_dto.id_team == match.id_local_team else match.id_local_team
            
            if data.get('slug_point_for_team'):
                pt_dto = await self._team_repo.get_by_slug(session, data['slug_point_for_team'])
                point_team_id = pt_dto.id_team

        final_result = result_symbol if result_symbol else "+"

        new_action = Action(
            slug=f"act-{uuid.uuid4().hex[:8]}",
            id_match=match.id_match,
            id_set=current_set.id_set,
            id_team=team_dto.id_team,
            id_player=player_id,
            id_point_for_team=point_team_id,
            id_analyst=analyst.id_analyst,
            player_position=data.get('player_position'),
            action_type=data['action_type'],
            result=final_result, 
            start_x=data.get('start_x', 0),
            start_y=data.get('start_y', 0),
            end_x=data.get('end_x', 0),
            end_y=data.get('end_y', 0)
        )
        
        action_dto = await self._action_repo.create(session, new_action)
        result_payload = {"action": action_dto, "match_finished": False, "new_set": None}
        
        if point_team_id:
            await self._handle_rotation(
                session, 
                current_set, 
                point_team_id, 
                match.id_match,
                action_type=data['action_type'],
                action_result=final_result
            )
            await self._update_score(session, current_set, match, point_team_id, result_payload)

        lineup_action_team = await self._lineup_repo.get_active_lineup_by_team_and_match(session, match.id_match, team_dto.id_team)
        if lineup_action_team:
            await self._check_libero_substitution(
                session, 
                lineup_action_team.id_lineup, 
                action_type=data['action_type'], 
                action_result=final_result,
                action_team_id=team_dto.id_team,
                point_team_id=point_team_id,
                lineup_team_id=team_dto.id_team
            )

        if point_team_id and point_team_id != team_dto.id_team:
             lineup_other_team = await self._lineup_repo.get_active_lineup_by_team_and_match(session, match.id_match, point_team_id)
             if lineup_other_team:
                  await self._check_libero_substitution(
                      session, 
                      lineup_other_team.id_lineup, 
                      action_type=data['action_type'], 
                      action_result=final_result,
                      action_team_id=team_dto.id_team,
                      point_team_id=point_team_id,
                      lineup_team_id=point_team_id
                  )

        return result_payload

    async def _handle_rotation(self, session, current_set, point_team_id, match_id, action_type, action_result):
        last_point = await self._action_repo.get_previous_point_action(session, current_set.id_set)
        
        should_rotate = False
        if last_point and last_point.id_point_for_team != point_team_id:
            should_rotate = True

        if should_rotate:
            lineup = await self._lineup_repo.get_active_lineup_by_team_and_match(session, match_id, point_team_id)
            if lineup:
                positions = await self._lineup_repo.get_court_positions(session, lineup.id_lineup)
                rotation_map = {1: 6, 6: 5, 5: 4, 4: 3, 3: 2, 2: 1}
                
                for pos in positions:
                    if pos.current_position in rotation_map:
                        new_pos = rotation_map[pos.current_position]
                        await self._lineup_repo.update_position(session, pos, new_pos)
                
                await session.flush() 
                await self._check_libero_substitution(
                    session, 
                    lineup.id_lineup, 
                    action_type=action_type, 
                    action_result=action_result, 
                    action_team_id=None, 
                    point_team_id=point_team_id, 
                    lineup_team_id=point_team_id, 
                    check_only_exit=True
                )

    async def _check_libero_substitution(
        self, 
        session, 
        lineup_id: int, 
        action_type: str = None, 
        action_result: str = None,
        action_team_id: int = None,
        point_team_id: int = None,
        lineup_team_id: int = None,
        check_only_exit: bool = False
    ):
        all_players = await self._lineup_repo.get_all_positions_by_lineup(session, lineup_id)
        libero = next((p for p in all_players if p.initial_position not in [1, 2, 3, 4, 5, 6]), None)
        target_1 = next((p for p in all_players if getattr(p, 'libero_swap_target', False) is True), None)
        
        if not libero or not target_1:
            return

        opposite_map = {1: 4, 4: 1, 2: 5, 5: 2, 3: 6, 6: 3}
        target_2_initial_pos = opposite_map.get(target_1.initial_position)
        target_2 = next((p for p in all_players if getattr(p, 'initial_position', None) == target_2_initial_pos), None)
        targets = [t for t in [target_1, target_2] if t is not None]

        if getattr(libero, 'is_on_court', False) and getattr(libero, 'current_position', None) == 4:
            libero.is_on_court = False
            libero.current_position = None
            target_out = next((t for t in targets if not getattr(t, 'is_on_court', False)), None)
            if target_out:
                target_out.is_on_court = True
                target_out.current_position = 4
            await session.flush()

        if check_only_exit:
            return 

        for target in targets:
            if getattr(target, 'is_on_court', False) and getattr(target, 'current_position', None) == 1:
                if getattr(target, 'is_setter', False): continue 

                should_libero_enter = False

                if point_team_id == lineup_team_id:
                    if action_type == 'SERVE' and action_team_id == lineup_team_id:
                        if action_result in ['+', '-', '--']:
                            should_libero_enter = True

                else:
                    should_libero_enter = True

                if should_libero_enter:
                    target.is_on_court = False
                    target.current_position = None 
                    libero.is_on_court = True
                    libero.current_position = 1
                    await session.flush()
                    break

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
            await session.flush()

            finished_sets = await self._set_repo.get_finished_sets_by_match_slug(session, match.slug)
            
            local_sets_won = sum(1 for s in finished_sets if s.local_points > s.visitor_points)
            visitor_sets_won = sum(1 for s in finished_sets if s.local_points < s.visitor_points)

            if local_sets_won == 3 or visitor_sets_won == 3:
                match.status = "finished"
                match.finished_at = datetime.now()
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

    async def get_actions_type_from_team(self, session: Any, team_slug: str, action_type: str, user_email: str, role: str) -> list[ActionStatDTO]:
        team = await self._team_repo.get_by_slug(session, team_slug)
        if not team:
            raise ValueError("TEAM_NOT_FOUND")
        
        id_analyst_to_query = None

        if role.lower() == "analyst":
            analyst = await self._analyst_repo.get_by_email(session, user_email)
            if not analyst: 
                raise ValueError("ANALYST_NOT_FOUND")
            id_analyst_to_query = analyst.id_analyst

        elif role.lower() == "coach":
            coach = await self._coach_repo.get_by_email(session, user_email) 
            if not coach or not coach.id_team: 
                raise ValueError("COACH_NOT_FOUND_OR_NO_TEAM")
            
            analyst_of_team = await self._analyst_repo.get_by_team_id(session, coach.id_team)
            if not analyst_of_team: 
                raise ValueError("TEAM_ANALYST_NOT_FOUND")
            id_analyst_to_query = analyst_of_team.id_analyst
        
        if id_analyst_to_query is None:
            raise PermissionError("Acceso denegado: Rol no reconocido para estadísticas.")

        actions = await self._action_repo.get_actions_type_from_team(
            session, 
            team.id_team, 
            action_type, 
            id_analyst_to_query
        )
        
        return [ActionModelMapper.to_stat_dto(a) for a in actions]
    
    async def get_actions_type_from_team_against_team(self, session: Any, team_slug: str, action_type: str, user_email: str, role: str) -> list[ActionStatDTO]:
        team = await self._team_repo.get_by_slug(session, team_slug)
        if not team:
            raise ValueError("TEAM_NOT_FOUND")
        
        id_analyst_to_query = None

        if role.lower() == "analyst":
            analyst = await self._analyst_repo.get_by_email(session, user_email)
            if not analyst: 
                raise ValueError("ANALYST_NOT_FOUND")
            id_analyst_to_query = analyst.id_analyst

        elif role.lower() == "coach":
            coach = await self._coach_repo.get_by_email(session, user_email) 
            if not coach: 
                raise ValueError("COACH_NOT_FOUND")
            
            analyst_of_team = await self._analyst_repo.get_by_team_id(session, coach.id_team)
            if not analyst_of_team: 
                raise ValueError("TEAM_ANALYST_NOT_FOUND")
            id_analyst_to_query = analyst_of_team.id_analyst

        if id_analyst_to_query is None:
            raise PermissionError("Acceso denegado.")

        actions = await self._action_repo.get_actions_type_from_team_against_team(
            session, 
            team.id_team, 
            action_type, 
            id_analyst_to_query
        )
        return [ActionModelMapper.to_stat_dto(a) for a in actions]
    
    async def get_actions_type_from_player(self, session: Any, player_slug: str, action_type: str, user_email: str, role: str) -> list[ActionStatDTO]:
        player = await self._player_repo.get_by_slug(session, player_slug)
        if not player:
            raise ValueError("PLAYER_NOT_FOUND")
        
        id_analyst_to_query = None

        if role.lower() == "analyst":
            analyst = await self._analyst_repo.get_by_email(session, user_email)
            if not analyst: 
                raise ValueError("ANALYST_NOT_FOUND")
            id_analyst_to_query = analyst.id_analyst

        elif role.lower() == "coach":
            coach = await self._coach_repo.get_by_email(session, user_email)
            if not coach: 
                raise ValueError("COACH_NOT_FOUND")
            
            analyst_of_team = await self._analyst_repo.get_by_team_id(session, coach.id_team)
            if not analyst_of_team: 
                raise ValueError("TEAM_ANALYST_NOT_FOUND")
            id_analyst_to_query = analyst_of_team.id_analyst

        actions = await self._action_repo.get_actions_type_from_player(
            session, 
            player.id_player, 
            action_type, 
            id_analyst_to_query
        )
        
        return [ActionModelMapper.to_stat_dto(a) for a in actions]
    
    async def get_actions_type_from_player_against_team(self, session: Any, player_slug: str, action_type: str, user_email: str, role: str) -> list[ActionStatDTO]:
        player = await self._player_repo.get_by_slug(session, player_slug)
        if not player:
            raise ValueError("PLAYER_NOT_FOUND")
        
        id_analyst_to_query = None

        if role.lower() == "analyst":
            analyst = await self._analyst_repo.get_by_email(session, user_email)
            if not analyst: 
                raise ValueError("ANALYST_NOT_FOUND")
            id_analyst_to_query = analyst.id_analyst

        elif role.lower() == "coach":
            coach = await self._coach_repo.get_by_email(session, user_email)
            if not coach: 
                raise ValueError("COACH_NOT_FOUND")
            
            analyst_of_team = await self._analyst_repo.get_by_team_id(session, coach.id_team)
            if not analyst_of_team: 
                raise ValueError("TEAM_ANALYST_NOT_FOUND")
            id_analyst_to_query = analyst_of_team.id_analyst

        actions = await self._action_repo.get_actions_type_from_player_against_team(session, player.id_player, action_type, id_analyst_to_query)
        return [ActionModelMapper.to_stat_dto(a) for a in actions]
    
    async def get_general_stats_by_team(self, session: Any, team_slug: str, user_email: str, role: str) -> ActionGeneralStatsDTO:
        team = await self._team_repo.get_by_slug(session, team_slug)
        if not team:
            raise ValueError("TEAM_NOT_FOUND")
        
        id_analyst_to_query = None
        
        if role.lower() == "analyst":
            analyst = await self._analyst_repo.get_by_email(session, user_email)
            if not analyst: 
                raise ValueError("ANALYST_NOT_FOUND")
            id_analyst_to_query = analyst.id_analyst

        elif role.lower() == "coach":
            coach = await self._coach_repo.get_by_email(session, user_email) 
            if not coach: 
                raise ValueError("COACH_NOT_FOUND")
            
            if coach.id_team != team.id_team:
                raise PermissionError("No tienes permiso para ver estadísticas de este equipo.")
            
            analyst_of_team = await self._analyst_repo.get_by_team_id(session, coach.id_team)
            if not analyst_of_team: 
                raise ValueError("TEAM_ANALYST_NOT_FOUND")
            
            id_analyst_to_query = analyst_of_team.id_analyst

        if id_analyst_to_query is None:
            raise PermissionError("Acceso denegado: Rol no autorizado.")

        stats_dto = await self._action_repo.get_general_stats_by_team(
            session, 
            team.id_team, 
            team_slug, 
            id_analyst_to_query
        )
        
        return stats_dto
    
    async def get_actions_type_from_team_match_team(self, session: Any, team_slug: str, action_type: str, match_slug: str) -> list[ActionStatDTO]:
        team = await self._team_repo.get_by_slug(session, team_slug)
        if not team:
            raise ValueError("TEAM_NOT_FOUND")

        match = await self._match_repo.get_model_by_slug(session, match_slug)
        if not match:
            raise ValueError("MATCH_NOT_FOUND")

        actions = await self._action_repo.get_actions_type_from_team_match(session, team.id_team, action_type, match.id_match)
        return [ActionModelMapper.to_stat_dto(a) for a in actions]
    
    async def get_actions_type_from_team_match_against_team(self, session: Any, team_slug: str, action_type: str, match_slug: str) -> list[ActionStatDTO]:
        team = await self._team_repo.get_by_slug(session, team_slug)
        if not team:
            raise ValueError("TEAM_NOT_FOUND")

        match = await self._match_repo.get_model_by_slug(session, match_slug)
        if not match:
            raise ValueError("MATCH_NOT_FOUND")

        actions = await self._action_repo.get_actions_type_from_team_match_against_team(session, team.id_team, action_type, match.id_match)
        return [ActionModelMapper.to_stat_dto(a) for a in actions]
    
    async def get_actions_type_from_player_match_team(self, session: Any, player_slug: str, action_type: str, match_slug: str) -> list[ActionStatDTO]:
        player = await self._player_repo.get_by_slug(session, player_slug)
        if not player:
            raise ValueError("PLAYER_NOT_FOUND")

        match = await self._match_repo.get_model_by_slug(session, match_slug)
        if not match:
            raise ValueError("MATCH_NOT_FOUND")

        actions = await self._action_repo.get_actions_type_from_player_match(session, player.id_player, action_type, match.id_match)
        return [ActionModelMapper.to_stat_dto(a) for a in actions]
    
    async def get_actions_type_from_player_match_against_team(self, session: Any, player_slug: str, action_type: str, match_slug: str) -> list[ActionStatDTO]:
        player = await self._player_repo.get_by_slug(session, player_slug)
        if not player:
            raise ValueError("PLAYER_NOT_FOUND")

        match = await self._match_repo.get_model_by_slug(session, match_slug)
        if not match:
            raise ValueError("MATCH_NOT_FOUND")

        actions = await self._action_repo.get_actions_type_from_player_match_against_team(session, player.id_player, action_type, match.id_match)
        return [ActionModelMapper.to_stat_dto(a) for a in actions]

    async def get_action_result_breakdown_by_team(
        self,
        session: Any,
        team_slug: str,
        user_email: str,
        role: str
    ) -> TeamActionResultBreakdownDTO:
        team = await self._team_repo.get_by_slug(session, team_slug)
        if not team:
            raise ValueError("TEAM_NOT_FOUND")

        id_analyst_to_query = None

        if role.lower() == "analyst":
            analyst = await self._analyst_repo.get_by_email(session, user_email)
            if not analyst:
                raise ValueError("ANALYST_NOT_FOUND")
            id_analyst_to_query = analyst.id_analyst

        elif role.lower() == "coach":
            coach = await self._coach_repo.get_by_email(session, user_email)
            if not coach:
                raise ValueError("COACH_NOT_FOUND")

            if coach.id_team != team.id_team:
                raise PermissionError("No tienes permiso para ver estadísticas de este equipo.")

            analyst_of_team = await self._analyst_repo.get_by_team_id(session, coach.id_team)
            if not analyst_of_team:
                raise ValueError("TEAM_ANALYST_NOT_FOUND")

            id_analyst_to_query = analyst_of_team.id_analyst

        if id_analyst_to_query is None:
            raise PermissionError("Acceso denegado: Rol no autorizado.")

        return await self._action_repo.get_action_result_breakdown_by_team(
            session,
            team.id_team,
            team_slug,
            id_analyst_to_query,
        )

    async def get_action_result_breakdown_by_player(
        self,
        session: Any,
        player_slug: str,
        user_email: str,
        role: str
    ) -> PlayerActionResultBreakdownDTO:
        player = await self._player_repo.get_by_slug(session, player_slug)
        if not player:
            raise ValueError("PLAYER_NOT_FOUND")

        id_analyst_to_query = None

        if role.lower() == "analyst":
            analyst = await self._analyst_repo.get_by_email(session, user_email)
            if not analyst:
                raise ValueError("ANALYST_NOT_FOUND")
            id_analyst_to_query = analyst.id_analyst

        elif role.lower() == "coach":
            coach = await self._coach_repo.get_by_email(session, user_email)
            if not coach:
                raise ValueError("COACH_NOT_FOUND")

            analyst_of_team = await self._analyst_repo.get_by_team_id(session, coach.id_team)
            if not analyst_of_team:
                raise ValueError("TEAM_ANALYST_NOT_FOUND")

            id_analyst_to_query = analyst_of_team.id_analyst

        if id_analyst_to_query is None:
            raise PermissionError("Acceso denegado: Rol no autorizado.")

        return await self._action_repo.get_action_result_breakdown_by_player(
            session,
            player.id_player,
            player_slug,
            id_analyst_to_query,
        )

    async def get_action_result_breakdown_by_team_match(
        self,
        session: Any,
        team_slug: str,
        match_slug: str,
        user_email: str,
        role: str
    ) -> TeamActionResultBreakdownByMatchDTO:
        team = await self._team_repo.get_by_slug(session, team_slug)
        if not team:
            raise ValueError("TEAM_NOT_FOUND")

        match = await self._match_repo.get_model_by_slug(session, match_slug)
        if not match:
            raise ValueError("MATCH_NOT_FOUND")

        id_analyst_to_query = None

        if role.lower() == "analyst":
            analyst = await self._analyst_repo.get_by_email(session, user_email)
            if not analyst:
                raise ValueError("ANALYST_NOT_FOUND")
            id_analyst_to_query = analyst.id_analyst

        elif role.lower() == "coach":
            coach = await self._coach_repo.get_by_email(session, user_email)
            if not coach:
                raise ValueError("COACH_NOT_FOUND")

            if coach.id_team != team.id_team:
                raise PermissionError("No tienes permiso para ver estadísticas de este equipo.")

            analyst_of_team = await self._analyst_repo.get_by_team_id(session, coach.id_team)
            if not analyst_of_team:
                raise ValueError("TEAM_ANALYST_NOT_FOUND")

            id_analyst_to_query = analyst_of_team.id_analyst

        if id_analyst_to_query is None:
            raise PermissionError("Acceso denegado: Rol no autorizado.")

        return await self._action_repo.get_action_result_breakdown_by_team_match(
            session,
            team.id_team,
            team_slug,
            match.id_match,
            match_slug,
            id_analyst_to_query,
        )

    async def get_action_result_breakdown_by_player_match(
        self,
        session: Any,
        player_slug: str,
        match_slug: str,
        user_email: str,
        role: str
    ) -> PlayerActionResultBreakdownByMatchDTO:
        player = await self._player_repo.get_by_slug(session, player_slug)
        if not player:
            raise ValueError("PLAYER_NOT_FOUND")

        match = await self._match_repo.get_model_by_slug(session, match_slug)
        if not match:
            raise ValueError("MATCH_NOT_FOUND")

        id_analyst_to_query = None

        if role.lower() == "analyst":
            analyst = await self._analyst_repo.get_by_email(session, user_email)
            if not analyst:
                raise ValueError("ANALYST_NOT_FOUND")
            id_analyst_to_query = analyst.id_analyst

        elif role.lower() == "coach":
            coach = await self._coach_repo.get_by_email(session, user_email)
            if not coach:
                raise ValueError("COACH_NOT_FOUND")

            analyst_of_team = await self._analyst_repo.get_by_team_id(session, coach.id_team)
            if not analyst_of_team:
                raise ValueError("TEAM_ANALYST_NOT_FOUND")

            id_analyst_to_query = analyst_of_team.id_analyst

        if id_analyst_to_query is None:
            raise PermissionError("Acceso denegado: Rol no autorizado.")

        return await self._action_repo.get_action_result_breakdown_by_player_match(
            session,
            player.id_player,
            player_slug,
            match.id_match,
            match_slug,
            id_analyst_to_query,
        )
