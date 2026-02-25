from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.repositories.league import ILeagueRepository
from app.infrastructure.models.league import League
from app.infrastructure.models.coach import Coach
from app.infrastructure.models.season_team import SeasonTeam
from app.infrastructure.mappers.league import LeagueModelMapper
from app.domain.dtos.league import LeagueDTO

class LeagueRepository(ILeagueRepository):
    def __init__(self, mapper: LeagueModelMapper):
        self.mapper = mapper

    async def get_league_by_coach_email(self, session: AsyncSession, email: str) -> Optional[LeagueDTO]:
        query = (
            select(League)
            .join(SeasonTeam, League.id_league == SeasonTeam.id_league)
            .join(Coach, SeasonTeam.id_coach == Coach.id_coach)
            .where(Coach.email == email)
            .options(
                selectinload(League.category),
                selectinload(League.admin)
            )
        )
        
        result = await session.execute(query)
        league_model = result.scalar_one_or_none()
        
        print(f"DEBUG REPO: Buscando email {email}. Resultado: {league_model}")
        
        if not league_model:
            return None
            
        return self.mapper.to_dto(league_model)