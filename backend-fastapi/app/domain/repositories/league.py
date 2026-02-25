import abc
from typing import Any, Optional
from app.domain.dtos.league import LeagueDTO

class ILeagueRepository(abc.ABC):
    @abc.abstractmethod
    async def get_league_by_coach_email(self, session: Any, email: str) -> Optional[LeagueDTO]:
        """Obtiene la liga actual uniendo Coach -> SeasonTeam -> League."""
        ...