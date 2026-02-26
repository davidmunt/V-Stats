from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.repositories.set import ISetRepository
from app.domain.dtos.set import SetDTO
from app.infrastructure.models.set import Set
from app.infrastructure.models.match import Match
from app.domain.mapper import IModelMapper

class SetRepository(ISetRepository):
    def __init__(self, set_mapper: IModelMapper):
        self.mapper = set_mapper

    async def get_actual_set_by_match_slug(self, session: AsyncSession, match_slug: str) -> Optional[SetDTO]:
        """
        Obtiene el set actual de un partido (el set con el número más alto).
        """
        query = (
            select(Set)
            .join(Match)
            .where(Match.slug == match_slug)
            .order_by(Set.set_number.desc())
            .limit(1)
            .options(selectinload(Set.match))
        )
        
        result = await session.execute(query)
        set_model = result.scalar_one_or_none()
        return self.mapper.to_dto(set_model)