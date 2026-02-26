from typing import List
from app.domain.services.team import ITeamService
from app.domain.repositories.team import ITeamRepository
from app.domain.dtos.team import TeamDTO

class TeamService(ITeamService):
    def __init__(self, team_repository: ITeamRepository):
        self._team_repository = team_repository

    async def get_match_teams(self, session, match_slug: str) -> List[TeamDTO]:
        """
        Llama al repositorio para obtener los equipos del partido.
        Aquí podrías añadir lógica extra, como filtrar solo equipos activos.
        """
        return await self._team_repository.get_teams_by_match_slug(session, match_slug)