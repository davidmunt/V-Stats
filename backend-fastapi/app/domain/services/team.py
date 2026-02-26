import abc
from typing import Any, List
from app.domain.dtos.team import TeamDTO

class ITeamService(abc.ABC):
    """Interfaz del servicio de Equipos (Business Logic)."""

    @abc.abstractmethod
    async def get_match_teams(self, session: Any, match_slug: str) -> List[TeamDTO]:
        """
        Lógica para obtener los dos equipos involucrados en un partido.
        """
        ...