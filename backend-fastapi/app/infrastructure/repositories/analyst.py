from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.repositories.analyst import IAnalystRepository
from app.domain.dtos.analyst import AnalystDTO
from app.infrastructure.models.analyst import Analyst
from app.domain.mapper import IModelMapper

class AnalystRepository(IAnalystRepository):
    def __init__(self, analyst_mapper: IModelMapper):
        self.mapper = analyst_mapper

    async def get_by_id(self, session: AsyncSession, analyst_id: int) -> Optional[AnalystDTO]:
        query = select(Analyst).where(Analyst.id_analyst == analyst_id).options(selectinload(Analyst.team))
        result = await session.execute(query)
        analyst_model = result.scalar_one_or_none()
        return self.mapper.to_dto(analyst_model)

    async def get_by_slug(self, session: AsyncSession, slug: str) -> Optional[AnalystDTO]:
        query = select(Analyst).where(Analyst.slug == slug).options(selectinload(Analyst.team))
        result = await session.execute(query)
        analyst_model = result.scalar_one_or_none()
        return self.mapper.to_dto(analyst_model)
    
    async def get_by_email(self, session: AsyncSession, email: str) -> Optional[AnalystDTO]:
        query = select(Analyst).where(Analyst.email == email).options(selectinload(Analyst.team))
        result = await session.execute(query)
        analyst_model = result.scalar_one_or_none()
        return self.mapper.to_dto(analyst_model)

    async def get_free_analysts(self, session: AsyncSession) -> List[AnalystDTO]:
        query = select(Analyst).where(Analyst.id_team == None)
        result = await session.execute(query)
        analysts = result.scalars().all()
        return [self.mapper.to_dto(c) for c in analysts]

    async def get_assigned_analysts(self, session: AsyncSession) -> List[AnalystDTO]:
        query = select(Analyst).where(Analyst.id_team != None).options(selectinload(Analyst.team))
        result = await session.execute(query)
        analysts = result.scalars().all()
        return [self.mapper.to_dto(c) for c in analysts]