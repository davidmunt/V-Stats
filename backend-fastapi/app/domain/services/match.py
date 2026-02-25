import abc
from typing import List, Optional
from app.domain.dtos.match import MatchDTO

class IMatchService(abc.ABC):
    """Interfaz del servicio de Partidos (Business Logic)."""

    @abc.abstractmethod
    async def get_user_next_match(self, session: any, email: str, role: str) -> Optional[MatchDTO]:
        """
        Lógica para obtener el próximo partido programado ('scheduled') 
        del equipo asociado al usuario (coach o analyst).
        """
        ...

    @abc.abstractmethod
    async def get_league_matches(self, session: any, league_slug: str) -> List[MatchDTO]:
        """Lógica para obtener todos los partidos pertenecientes a una liga."""
        ...