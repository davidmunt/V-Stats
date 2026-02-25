import abc
from typing import Any, List, Optional
from app.domain.dtos.match import MatchDTO

class IMatchRepository(abc.ABC):
    """Interfaz del repositorio de Partidos."""

    @abc.abstractmethod
    async def get_next_match_by_team_id(self, session: Any, team_id: int) -> Optional[MatchDTO]:
        """Obtiene el próximo partido programado para un equipo."""
        ...

    @abc.abstractmethod
    async def get_matches_by_league_slug(self, session: Any, league_slug: str) -> List[MatchDTO]:
        """Obtiene todos los partidos de una liga mediante su slug."""
        ...