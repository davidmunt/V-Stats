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
        await session.flush() # Para obtener el ID generado si fuera necesario
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