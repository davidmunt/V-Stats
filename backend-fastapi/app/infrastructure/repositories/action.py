from typing import Optional
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.repositories.action import IActionRepository
from app.infrastructure.models.action import Action
from app.domain.dtos.action import ActionDTO
from app.domain.mapper import IModelMapper

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