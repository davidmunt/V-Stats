from typing import Optional
from sqlalchemy import case, func, select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.repositories.action import IActionRepository
from app.infrastructure.models.action import Action
from app.infrastructure.models.set import Set 
from app.infrastructure.models.player import Player
from app.domain.dtos.action import ActionDTO, ActionStatDTO, ActionGeneralStatsDTO
from app.domain.mapper import IModelMapper
from sqlalchemy.orm import joinedload

class ActionRepository(IActionRepository):
    def __init__(self, action_mapper: IModelMapper):
        self.mapper = action_mapper

    async def create(self, session: AsyncSession, action_model: Action) -> ActionDTO:
        session.add(action_model)
        await session.flush() 
        await session.refresh(action_model, ["match", "set", "team", "player", "point_for_team"])
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

    async def get_actions_type_from_team(self, session: AsyncSession, id_team: int, action_type: str) -> list[Action]:
        """Obtiene todas las acciones de un tipo específico que han generado punto para un equipo."""
        query = (
            select(Action)
            .where(
                and_(
                    Action.id_team == id_team,
                    Action.action_type == action_type,
                    Action.id_point_for_team == id_team,
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
    
    async def get_actions_type_from_team_against_team(self, session: AsyncSession, id_team: int, action_type: str) -> list[Action]:
        """Obtiene todas las acciones de un tipo específico que han hecho punto contra el equipo (errores propios)."""
        query = (
            select(Action)
            .where(
                and_(
                    Action.id_team == id_team,
                    Action.action_type == action_type,
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
    
    async def get_actions_type_from_player(self, session: AsyncSession, id_player: int, action_type: str) -> list[Action]:
        """Obtiene todas las acciones de un tipo específico que han generado punto para un jugador."""
        query = (
            select(Action)
            .where(
                and_(
                    Action.id_player == id_player,
                    Action.action_type == action_type,
                    Action.id_point_for_team == Action.id_team 
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
    
    async def get_actions_type_from_player_against_team(self, session: AsyncSession, id_player: int, action_type: str) -> list[Action]:
        """Obtiene todas las acciones de un tipo específico de un jugador que terminaron en punto rival."""
        query = (
            select(Action)
            .where(
                and_(
                    Action.id_player == id_player,
                    Action.action_type == action_type,
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
    
    async def get_general_stats_by_team(self, session: AsyncSession, id_team: int, team_slug: str) -> ActionGeneralStatsDTO:
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
            .where(Action.id_team == id_team)
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