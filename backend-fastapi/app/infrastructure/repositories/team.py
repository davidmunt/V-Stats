from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.domain.repositories.team import ITeamRepository
from app.domain.dtos.team import TeamDTO
from app.infrastructure.models.team import Team
from app.infrastructure.models.season_team import SeasonTeam
from app.infrastructure.mappers.team import TeamModelMapper

class TeamRepository(ITeamRepository):
    def __init__(self, team_mapper: TeamModelMapper):
        self.mapper = team_mapper

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