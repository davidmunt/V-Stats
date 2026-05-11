from typing import Optional
from sqlalchemy import case, func, select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.repositories.action import IActionRepository
from app.infrastructure.models.action import Action
from app.infrastructure.models.set import Set 
from app.infrastructure.models.player import Player
from app.domain.dtos.action import (
    ActionDTO,
    ActionStatDTO,
    ActionGeneralStatsDTO,
    ActionResultBreakdownStatsDTO,
    TeamActionResultBreakdownDTO,
    PlayerActionResultBreakdownDTO,
    TeamActionResultBreakdownByMatchDTO,
    PlayerActionResultBreakdownByMatchDTO,
)
from app.domain.mapper import IModelMapper
from sqlalchemy.orm import joinedload

class ActionRepository(IActionRepository):
    def __init__(self, action_mapper: IModelMapper):
        self.mapper = action_mapper

    async def create(self, session: AsyncSession, action_model: Action) -> ActionDTO:
        session.add(action_model)
        await session.flush() 
        await session.refresh(action_model, ["match", "set", "team", "player", "analyst", "point_for_team"])
        return self.mapper.to_dto(action_model)

    async def get_last_point_action(self, session: AsyncSession, id_set: int) -> Optional[Action]:
        """Busca la última acción que generó un punto en este set."""
        query = (
            select(Action)
            .where(
                and_(
                    Action.id_set == id_set,
                    Action.id_point_for_team != None
                )
            )
            .order_by(Action.created_at.desc())
            .limit(1)
        )
        result = await session.execute(query)
        return result.scalar_one_or_none()
    
    async def get_last_point_by_team(self, session: AsyncSession, id_set: int, id_point_team: int) -> Optional[Action]:
        """
        Busca la última acción en un set donde el punto fue para el equipo especificado.
        """
        query = (
            select(Action)
            .where(
                and_(
                    Action.id_set == id_set,
                    Action.id_point_for_team == id_point_team,
                    Action.is_active == True
                )
            )
            .order_by(Action.created_at.desc())
            .limit(1)
        )
        result = await session.execute(query)
        return result.scalar_one_or_none()
    
    async def get_previous_point_action(self, session: AsyncSession, id_set: int) -> Optional[Action]:
        """Obtiene el penúltimo punto para comparar posesión de saque."""
        query = (
            select(Action)
            .where(and_(Action.id_set == id_set, Action.id_point_for_team != None))
            .order_by(Action.id_action.desc())
            .offset(1) 
            .limit(1)
        )
        result = await session.execute(query)
        return result.scalar_one_or_none()

    async def delete(self, session: AsyncSession, action_model: Action) -> None:
        """Elimina la acción de la base de datos."""
        await session.delete(action_model)
        await session.flush()

    async def get_actions_type_from_team(self, session: AsyncSession, id_team: int, action_type: str, analyst_id: int) -> list[Action]:
        """Obtiene acciones que generaron punto o saques que mantuvieron el juego."""
        query = (
            select(Action)
            .where(
                and_(
                    Action.id_team == id_team,
                    Action.action_type == action_type,
                    Action.id_analyst == analyst_id,
                    or_(
                        Action.id_point_for_team == id_team,
                        and_(
                            Action.action_type == 'SERVE',
                            Action.result.in_(['+', '-']) 
                        )
                    )
                )
            )
            .options(
                joinedload(Action.team),
                joinedload(Action.player).selectinload(Player.seasons),
                joinedload(Action.set).joinedload(Set.match),
                joinedload(Action.point_for_team)
            )
        )
        result = await session.execute(query)
        return result.scalars().unique().all()
    
    async def get_actions_type_from_team_against_team(self, session: AsyncSession, id_team: int, action_type: str, analyst_id: int) -> list[Action]:
        """Obtiene todas las acciones de un tipo específico que han hecho punto contra el equipo (errores propios)."""
        query = (
            select(Action)
            .where(
                and_(
                    Action.id_team == id_team,
                    Action.action_type == action_type,
                    Action.id_point_for_team != id_team, 
                    Action.id_point_for_team.is_not(None),
                    Action.id_analyst == analyst_id
                )
            )
            .options(
                joinedload(Action.team),
                joinedload(Action.player).selectinload(Player.seasons),
                joinedload(Action.set).joinedload(Set.match),
                joinedload(Action.point_for_team)
            )
        )
        result = await session.execute(query)
        return result.scalars().unique().all()
    
    async def get_actions_type_from_player(self, session: AsyncSession, id_player: int, action_type: str, analyst_id: int) -> list[Action]:
        """Obtiene acciones de punto o saques continuos para un jugador específico."""
        query = (
            select(Action)
            .where(
                and_(
                    Action.id_player == id_player,
                    Action.action_type == action_type,
                    Action.id_analyst == analyst_id,
                    or_(
                        Action.id_point_for_team == Action.id_team,
                        and_(
                            Action.action_type == 'SERVE',
                            Action.result.in_(['+', '-'])
                        )
                    )
                )
            )
            .options(
                joinedload(Action.team),
                joinedload(Action.player).selectinload(Player.seasons),
                joinedload(Action.set).joinedload(Set.match),
                joinedload(Action.point_for_team)
            )
        )
        result = await session.execute(query)
        return result.scalars().unique().all()
    
    async def get_actions_type_from_player_against_team(self, session: AsyncSession, id_player: int, action_type: str, analyst_id: int) -> list[Action]:
        """Obtiene todas las acciones de un tipo específico de un jugador que terminaron en punto rival."""
        query = (
            select(Action)
            .where(
                and_(
                    Action.id_player == id_player,
                    Action.action_type == action_type,
                    Action.id_point_for_team != Action.id_team,
                    Action.id_point_for_team.is_not(None),
                    Action.id_analyst == analyst_id
                )
            )
            .options(
                joinedload(Action.team),
                joinedload(Action.player).selectinload(Player.seasons),
                joinedload(Action.set).joinedload(Set.match),
                joinedload(Action.point_for_team)
            )
        )
        result = await session.execute(query)
        return result.scalars().unique().all()
    
    async def get_actions_type_from_team_match(self, session: AsyncSession, id_team: int, action_type: str, id_match: int) -> list[Action]:
        """Obtiene acciones de un tipo específico para un equipo en un partido, incluyendo saques de continuidad."""
        query = (
            select(Action)
            .where(
                and_(
                    Action.id_team == id_team,
                    Action.action_type == action_type,
                    Action.set.has(Set.id_match == id_match),
                    or_(
                        Action.id_point_for_team == id_team,
                        and_(
                            Action.action_type == 'SERVE',
                            Action.result.in_(['+', '-'])
                        )
                    )
                )
            )
            .options(
                joinedload(Action.team),
                joinedload(Action.player).selectinload(Player.seasons),
                joinedload(Action.set).joinedload(Set.match),
                joinedload(Action.point_for_team)
            )
        )
        result = await session.execute(query)
        return result.scalars().unique().all()
    
    async def get_actions_type_from_team_match_against_team(self, session: AsyncSession, id_team: int, action_type: str, id_match: int) -> list[Action]:
        """Obtiene acciones de un tipo específico para un equipo en un partido específico que terminaron en punto rival."""
        query = (
            select(Action)
            .where(
                and_(
                    Action.id_team == id_team,
                    Action.action_type == action_type,
                    Action.set.has(Set.id_match == id_match),
                    Action.id_point_for_team != id_team,
                    Action.id_point_for_team.is_not(None)
                )
            )
            .options(
                joinedload(Action.team),
                joinedload(Action.player).selectinload(Player.seasons),
                joinedload(Action.set).joinedload(Set.match),
                joinedload(Action.point_for_team)
            )
        )
        result = await session.execute(query)
        return result.scalars().unique().all()
    
    async def get_actions_type_from_player_match(self, session: AsyncSession, id_player: int, action_type: str, id_match: int) -> list[Action]:
        """Obtiene acciones de un tipo específico para un jugador en un partido, incluyendo saques de continuidad."""
        query = (
            select(Action)
            .where(
                and_(
                    Action.id_player == id_player,
                    Action.action_type == action_type,
                    Action.set.has(Set.id_match == id_match),
                    or_(
                        Action.id_point_for_team == Action.id_team,
                        and_(
                            Action.action_type == 'SERVE',
                            Action.result.in_(['+', '-'])
                        )
                    )
                )
            )
            .options(
                joinedload(Action.team),
                joinedload(Action.player).selectinload(Player.seasons),
                joinedload(Action.set).joinedload(Set.match),
                joinedload(Action.point_for_team)
            )
        )
        result = await session.execute(query)
        return result.scalars().unique().all()
    
    async def get_actions_type_from_player_match_against_team(self, session: AsyncSession, id_player: int, action_type: str, id_match: int) -> list[Action]:
        """Obtiene acciones de un tipo específico para un jugador en un partido específico que terminaron en punto rival."""
        query = (
            select(Action)
            .where(
                and_(
                    Action.id_player == id_player,
                    Action.action_type == action_type,
                    Action.set.has(Set.id_match == id_match),
                    Action.id_point_for_team != Action.id_team,
                    Action.id_point_for_team.is_not(None)
                )
            )
            .options(
                joinedload(Action.team),
                joinedload(Action.player).selectinload(Player.seasons),
                joinedload(Action.set).joinedload(Set.match),
                joinedload(Action.point_for_team)
            )
        )
        result = await session.execute(query)
        return result.scalars().unique().all()
    
    async def get_general_stats_by_team(self, session: AsyncSession, id_team: int, team_slug: str, id_analyst: int) -> ActionGeneralStatsDTO:
        """Calcula porcentajes de éxito y error por tipo de acción para un equipo."""
        
        is_success = Action.id_point_for_team == id_team
        is_error = and_(Action.id_point_for_team != id_team, Action.id_point_for_team.is_not(None))
        
        query = (
            select(
                Action.action_type,
                func.count(Action.id_action).label("total"),
                func.count(case((is_success, 1))).label("successes"),
                func.count(case((is_error, 1))).label("errors")
            )
            .where(Action.id_team == id_team and Action.id_analyst == id_analyst)
            .group_by(Action.action_type)
        )
        
        result = await session.execute(query)
        rows = result.all()
        
        stats_map = {
            "SERVE": {"total": 0, "ok": 0, "err": 0},
            "RECEPTION": {"total": 0, "ok": 0, "err": 0},
            "BLOCK": {"total": 0, "ok": 0, "err": 0},
            "ATTACK": {"total": 0, "ok": 0, "err": 0},
        }
        
        total_actions = 0
        total_successes = 0
        total_errors = 0
        
        for row in rows:
            a_type, total, ok, err = row
            if a_type in stats_map:
                stats_map[a_type] = {"total": total, "ok": ok, "err": err}
            
            total_actions += total
            total_successes += ok
            total_errors += err

        def calc_pct(part, total):
            return round((part / total) * 100, 2) if total > 0 else 0.0

        return ActionGeneralStatsDTO(
            slug_team=team_slug,
            percentage_success=calc_pct(total_successes, total_actions),
            percentage_error=calc_pct(total_errors, total_actions),
            percentage_serve_success=calc_pct(stats_map["SERVE"]["ok"], stats_map["SERVE"]["total"]),
            percentage_serve_error=calc_pct(stats_map["SERVE"]["err"], stats_map["SERVE"]["total"]),
            percentage_reception_success=calc_pct(stats_map["RECEPTION"]["ok"], stats_map["RECEPTION"]["total"]),
            percentage_reception_error=calc_pct(stats_map["RECEPTION"]["err"], stats_map["RECEPTION"]["total"]),
            percentage_block_success=calc_pct(stats_map["BLOCK"]["ok"], stats_map["BLOCK"]["total"]),
            percentage_block_error=calc_pct(stats_map["BLOCK"]["err"], stats_map["BLOCK"]["total"]),
            percentage_attack_success=calc_pct(stats_map["ATTACK"]["ok"], stats_map["ATTACK"]["total"]),
            percentage_attack_error=calc_pct(stats_map["ATTACK"]["err"], stats_map["ATTACK"]["total"])
        )

    async def get_action_result_breakdown_by_team(
        self,
        session: AsyncSession,
        id_team: int,
        team_slug: str,
        id_analyst: int
    ) -> TeamActionResultBreakdownDTO:
        return TeamActionResultBreakdownDTO(
            slug_team=team_slug,
            stats=await self._build_action_result_breakdown_stats(
                session=session,
                id_team=id_team,
                id_player=None,
                id_match=None,
                id_analyst=id_analyst,
                slug_team=team_slug,
            ),
        )

    async def get_action_result_breakdown_by_player(
        self,
        session: AsyncSession,
        id_player: int,
        player_slug: str,
        id_analyst: int
    ) -> PlayerActionResultBreakdownDTO:
        return PlayerActionResultBreakdownDTO(
            slug_player=player_slug,
            stats=await self._build_action_result_breakdown_stats(
                session=session,
                id_team=None,
                id_player=id_player,
                id_match=None,
                id_analyst=id_analyst,
                slug_player=player_slug,
            ),
        )

    async def get_action_result_breakdown_by_team_match(
        self,
        session: AsyncSession,
        id_team: int,
        team_slug: str,
        id_match: int,
        match_slug: str,
        id_analyst: int
    ) -> TeamActionResultBreakdownByMatchDTO:
        return TeamActionResultBreakdownByMatchDTO(
            slug_team=team_slug,
            slug_match=match_slug,
            stats=await self._build_action_result_breakdown_stats(
                session=session,
                id_team=id_team,
                id_player=None,
                id_match=id_match,
                id_analyst=id_analyst,
                slug_team=team_slug,
                slug_match=match_slug,
            ),
        )

    async def get_action_result_breakdown_by_player_match(
        self,
        session: AsyncSession,
        id_player: int,
        player_slug: str,
        id_match: int,
        match_slug: str,
        id_analyst: int
    ) -> PlayerActionResultBreakdownByMatchDTO:
        return PlayerActionResultBreakdownByMatchDTO(
            slug_player=player_slug,
            slug_match=match_slug,
            stats=await self._build_action_result_breakdown_stats(
                session=session,
                id_team=None,
                id_player=id_player,
                id_match=id_match,
                id_analyst=id_analyst,
                slug_player=player_slug,
                slug_match=match_slug,
            ),
        )

    async def _build_action_result_breakdown_stats(
        self,
        session: AsyncSession,
        id_team: int = None,
        id_player: int = None,
        id_match: int = None,
        id_analyst: int = None,
        slug_team: str = None,
        slug_player: str = None,
        slug_match: str = None,
    ) -> ActionResultBreakdownStatsDTO:
        action_types = {
            "SERVE": "serve",
            "ATTACK": "attack",
            "BLOCK": "block",
            "RECEPTION": "reception",
            "SET": "colocacion",
            "DIG": "defensa",
        }
        result_codes = ["++", "+", "-", "--"]

        filters = [Action.is_active == True, Action.action_type.in_(action_types.keys()), Action.result.in_(result_codes)]
        if id_team is not None:
            filters.append(Action.id_team == id_team)
        if id_player is not None:
            filters.append(Action.id_player == id_player)
        if id_match is not None:
            filters.append(Action.id_match == id_match)
        if id_analyst is not None:
            filters.append(Action.id_analyst == id_analyst)

        query = (
            select(Action.action_type, Action.result, func.count(Action.id_action).label("total"))
            .where(and_(*filters))
            .group_by(Action.action_type, Action.result)
        )

        result = await session.execute(query)
        rows = result.all()

        counts: dict[str, dict[str, int]] = {action_type: {code: 0 for code in result_codes} for action_type in action_types}
        for row in rows:
            counts[row.action_type][row.result] = row.total or 0

        def pct(part: int, total: int) -> float:
            return round((part / total) * 100, 2) if total > 0 else 0.0

        stats_kwargs = {
            "slug_team": slug_team,
            "slug_player": slug_player,
            "slug_match": slug_match,
        }
        for action_type, prefix in action_types.items():
            total = sum(counts[action_type].values())
            stats_kwargs[f"percentage_{prefix}_double_plus"] = pct(counts[action_type]["++"], total)
            stats_kwargs[f"percentage_{prefix}_plus"] = pct(counts[action_type]["+"], total)
            stats_kwargs[f"percentage_{prefix}_minus"] = pct(counts[action_type]["-"], total)
            stats_kwargs[f"percentage_{prefix}_double_minus"] = pct(counts[action_type]["--"], total)

        return ActionResultBreakdownStatsDTO(**stats_kwargs)
