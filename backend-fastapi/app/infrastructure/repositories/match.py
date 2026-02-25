from typing import List, Optional
from datetime import datetime
from sqlalchemy import select, or_, and_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.repositories.match import IMatchRepository
from app.domain.dtos.match import MatchDTO
from app.infrastructure.models.match import Match
from app.infrastructure.models.league import League
from app.domain.mapper import IModelMapper

class MatchRepository(IMatchRepository):
    def __init__(self, match_mapper: IModelMapper):
        self.mapper = match_mapper

    async def get_next_match_by_team_id(self, session: AsyncSession, team_id: int) -> Optional[MatchDTO]:
        """
        Busca el próximo partido programado para un equipo (local o visitante)
        que sea posterior a la fecha actual.
        """
        now = datetime.now()
        query = (
            select(Match)
            .where(
                and_(
                    or_(Match.id_local_team == team_id, Match.id_visitor_team == team_id),
                    Match.date >= now,
                    Match.status == "scheduled",
                    Match.is_active == True
                )
            )
            .order_by(Match.date.asc())
            .limit(1)
            .options(
                selectinload(Match.league),
                selectinload(Match.local_team),
                selectinload(Match.visitor_team),
                selectinload(Match.venue)
            )
        )
        result = await session.execute(query)
        match_model = result.scalar_one_or_none()
        return self.mapper.to_dto(match_model)

    async def get_matches_by_league_slug(self, session: AsyncSession, league_slug: str) -> List[MatchDTO]:
        """
        Obtiene todos los partidos de una liga filtrando por el slug de la misma.
        """
        query = (
            select(Match)
            .join(League)
            .where(League.slug == league_slug)
            .options(
                selectinload(Match.league),
                selectinload(Match.local_team),
                selectinload(Match.visitor_team),
                selectinload(Match.venue)
            )
            .order_by(Match.date.desc())
        )
        result = await session.execute(query)
        matches = result.scalars().all()
        return [self.mapper.to_dto(m) for m in matches]