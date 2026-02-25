from typing import Optional
from app.domain.dtos.league import LeagueDTO
from app.domain.repositories.coach import ICoachRepository
from app.domain.repositories.analyst import IAnalystRepository
from app.domain.repositories.team import ITeamRepository
from app.domain.repositories.league import ILeagueRepository

class LeagueService:
    def __init__(
        self, 
        coach_repo: ICoachRepository,
        analyst_repo: IAnalystRepository, 
        team_repo: ITeamRepository,
        league_repo: ILeagueRepository
    ):
        self.coach_repo = coach_repo
        self.analyst_repo = analyst_repo
        self.team_repo = team_repo
        self.league_repo = league_repo

    async def get_league_by_user_email(self, session, email: str, role: str) -> Optional[LeagueDTO]:
        id_team = None

        if role == "coach":
            res = await self.league_repo.get_league_by_coach_email(session, email)
            print(f"DEBUG SERVICE: Resultado Repo: {res}")
            return res
        
        elif role == "analyst":
            user = await self.analyst_repo.get_by_email(session, email)
            id_team = user.id_team if user else None

        if not id_team:
            return None

        team_data = await self.team_repo.get_by_id(session, id_team)
        if not team_data or not team_data.id_league:
            return None

        return await self.league_repo.get_by_id(session, team_data.id_league)