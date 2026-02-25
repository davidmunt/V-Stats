from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.repositories.coach import ICoachRepository
from app.domain.dtos.coach import CoachDTO
from app.infrastructure.models.coach import Coach
from app.domain.mapper import IModelMapper

class CoachRepository(ICoachRepository):
    def __init__(self, coach_mapper: IModelMapper):
        self.mapper = coach_mapper

    async def get_by_id(self, session: AsyncSession, coach_id: int) -> Optional[CoachDTO]:
        query = select(Coach).where(Coach.id_coach == coach_id).options(selectinload(Coach.team))
        result = await session.execute(query)
        coach_model = result.scalar_one_or_none()
        return self.mapper.to_dto(coach_model)

    async def get_by_slug(self, session: AsyncSession, slug: str) -> Optional[CoachDTO]:
        query = select(Coach).where(Coach.slug == slug).options(selectinload(Coach.team))
        result = await session.execute(query)
        coach_model = result.scalar_one_or_none()
        return self.mapper.to_dto(coach_model)

    async def get_by_email(self, session: AsyncSession, email: str) -> Optional[CoachDTO]:
        query = select(Coach).where(Coach.email == email).options(selectinload(Coach.team))
        result = await session.execute(query)
        coach_model = result.scalar_one_or_none()
        return self.mapper.to_dto(coach_model)

    async def get_free_coaches(self, session: AsyncSession) -> List[CoachDTO]:
        query = select(Coach).where(Coach.id_team == None)
        result = await session.execute(query)
        coaches = result.scalars().all()
        return [self.mapper.to_dto(c) for c in coaches]

    async def get_assigned_coaches(self, session: AsyncSession) -> List[CoachDTO]:
        query = select(Coach).where(Coach.id_team != None).options(selectinload(Coach.team))
        result = await session.execute(query)
        coaches = result.scalars().all()
        return [self.mapper.to_dto(c) for c in coaches]