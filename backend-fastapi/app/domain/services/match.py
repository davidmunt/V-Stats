import abc
from typing import Any, List, Optional
from app.domain.dtos.match import MatchDTO

class IMatchService(abc.ABC):
    """Interfaz del servicio de Partidos (Business Logic)."""

    @abc.abstractmethod
    async def get_user_next_match(self, session: any, email: str, role: str) -> Optional[MatchDTO]:
        """
        Lógica para obtener el próximo partido del equipo asociado al usuario.
        Decidirá internamente si usa la lógica de Coach o Analyst.
        """
        ...

    @abc.abstractmethod
    async def get_league_matches(self, session: any, league_slug: str) -> List[MatchDTO]:
        """Lógica para obtener todos los partidos pertenecientes a una liga."""
        ...

    @abc.abstractmethod
    async def get_matches_by_team(self, session: any, team_slug: str) -> List[MatchDTO]:
        """Lógica para obtener todos los partidos de un equipo."""
        ...

    @abc.abstractmethod
    async def start_match(self, session: Any, match_slug: str, role: str) -> str:
        """
        Lógica para validar el rol y el estado del partido/set, 
        y cambiar ambos a 'live'. Devuelve un mensaje de éxito.
        """
        ...

    @abc.abstractmethod
    async def finalize_match(self, session: Any, match_model: Any, winner_id: int) -> None:
        """Marca el partido como finalizado y asigna al ganador."""
        ...