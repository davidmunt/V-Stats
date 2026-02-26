from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.repositories.team import ITeamRepository
from app.domain.dtos.team import TeamDTO
from app.infrastructure.models.team import Team
from app.infrastructure.models.season_team import SeasonTeam
from app.infrastructure.mappers.team import TeamModelMapper
from typing import List
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from app.infrastructure.models.match import Match
from app.domain.mapper import IModelMapper

class TeamRepository(ITeamRepository):
    def __init__(self, team_mapper: IModelMapper):
        self.mapper = team_mapper

    async def get_teams_by_match_slug(self, session: AsyncSession, match_slug: str) -> List[TeamDTO]:
        """
        Obtiene los dos equipos (local y visitante) de un partido con sus datos de temporada.
        """
        # 1. Buscamos el partido para obtener los IDs de los equipos y la liga
        match_query = select(Match).where(Match.slug == match_slug)
        match_result = await session.execute(match_query)
        match = match_result.scalar_one_or_none()
        
        if not match:
            return []

        # 2. Buscamos los SeasonTeam correspondientes a esos equipos en esa liga
        query = (
            select(SeasonTeam)
            .where(
                and_(
                    SeasonTeam.id_team.in_([match.id_local_team, match.id_visitor_team]),
                    SeasonTeam.id_league == match.id_league
                )
            )
            .options(
                selectinload(SeasonTeam.team),
                selectinload(SeasonTeam.venue),
                selectinload(SeasonTeam.coach),
                selectinload(SeasonTeam.analyst),
                selectinload(SeasonTeam.league)
            )
        )
        
        result = await session.execute(query)
        season_teams = result.scalars().all()
        
        return [self.mapper.to_dto(st) for st in season_teams]

    async def get_by_id(self, session: AsyncSession, id_team: int) -> Optional[TeamDTO]:
        team_query = select(Team).where(Team.id_team == id_team)
        team_result = await session.execute(team_query)
        team_model = team_result.scalar_one_or_none()

        if not team_model:
            return None

        st_query = select(SeasonTeam.id_league).where(
            SeasonTeam.id_team == id_team,
            SeasonTeam.is_active == True
        )
        st_result = await session.execute(st_query)
        id_league = st_result.scalar_one_or_none()

        return self.mapper.to_dto(team_model, id_league=id_league)
    
    async def get_by_slug(self, session: AsyncSession, slug: str) -> Optional[TeamDTO]:
        """
        Busca un equipo por su slug. 
        Este método es obligatorio por la interfaz ITeamRepository.
        """
        query = select(Team).where(Team.slug == slug)
        result = await session.execute(query)
        team_model = result.scalar_one_or_none()
        
        # El mapper se encargará de convertir el modelo Team a TeamDTO
        return self.mapper.to_dto(team_model)