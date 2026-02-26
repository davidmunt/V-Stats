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
    async def get_next_match_by_team_id_analyst(self, session: Any, team_id: int) -> Optional[MatchDTO]:
        """Obtiene partido con prioridad LIVE o programados hoy (para Analyst)."""
        ...

    @abc.abstractmethod
    async def get_matches_by_league_slug(self, session: Any, league_slug: str) -> List[MatchDTO]:
        """Obtiene todos los partidos de una liga mediante su slug."""
        ...

    @abc.abstractmethod
    async def get_model_by_slug(self, session: Any, slug: str) -> Optional[Any]:
        """Obtiene el modelo SQLAlchemy del partido para operaciones de escritura."""
        ...

    @abc.abstractmethod
    async def update_match_status(self, session: Any, match_slug: str, new_status: str) -> Optional[MatchDTO]:
        """Actualiza el estado de un partido y devuelve el DTO actualizado."""
        ...