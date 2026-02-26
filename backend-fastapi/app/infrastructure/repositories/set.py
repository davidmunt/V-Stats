from typing import List, Optional
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
    
    async def get_finished_sets_by_match_slug(self, session: AsyncSession, match_slug: str) -> List[SetDTO]:
        """
        Obtiene todos los sets de un partido que tengan el status 'finished'.
        """
        query = (
            select(Set)
            .join(Match)
            .where(
                Match.slug == match_slug,
                Set.status == "finished"
            )
            .order_by(Set.set_number.asc()) 
            .options(selectinload(Set.match))
        )
        
        result = await session.execute(query)
        sets_models = result.scalars().all()
        return [self.mapper.to_dto(s) for s in sets_models]
    
    async def get_actual_set_model_by_match_slug(self, session: AsyncSession, match_slug: str) -> Optional[Set]:
        """
        Obtiene el modelo SQLAlchemy del último set de un partido.
        """
        query = (
            select(Set)
            .join(Match)
            .where(Match.slug == match_slug)
            .order_by(Set.set_number.desc())
            .limit(1)
        )
        result = await session.execute(query)
        return result.scalar_one_or_none()

    async def update_set_status(self, session: AsyncSession, set_model: Set, new_status: str) -> None:
        """
        Actualiza el estado de un modelo de set proporcionado.
        """
        set_model.status = new_status
        await session.flush()