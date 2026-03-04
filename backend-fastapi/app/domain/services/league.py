import abc
from typing import Any, List, Optional
from app.domain.dtos.league import LeagueDTO

class ILeagueService(abc.ABC):
    """Interfaz del servicio de Ligas (Business Logic)."""

    @abc.abstractmethod
    async def get_league_by_coach_email(self, session: Any, email: str) -> Optional[LeagueDTO]:
        """Lógica para obtener la liga actual uniendo Coach -> SeasonTeam -> League."""
        ...
