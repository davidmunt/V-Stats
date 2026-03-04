import abc
from typing import Any, List, Optional
from app.domain.dtos.league import LeagueDTO

class ILeagueStandingService(abc.ABC):
    """Interfaz del servicio de Ligas (Business Logic)."""

    @abc.abstractmethod
    async def get_league_standings(self, session: Any, league_slug: str) -> List[dict]:
        """Lógica para obtener la tabla de posiciones de una liga específica."""
        ...