import abc
from typing import Any, List, Optional
from app.domain.dtos.set import SetDTO

class ISetService(abc.ABC):
    """Interfaz del servicio de Sets (Business Logic)."""

    @abc.abstractmethod
    async def get_actual_set(self, session: Any, match_slug: str) -> Optional[SetDTO]:
        """Lógica para obtener el set actual de un partido mediante su slug."""
        ...

    @abc.abstractmethod
    async def get_finished_sets(self, session: Any, match_slug: str) -> List[SetDTO]:
        """Lógica para obtener los sets finalizados de un partido."""
        ...

    @abc.abstractmethod
    async def update_actual_set_status(self, session: Any, match_slug: str, new_status: str) -> None:
        """Lógica para forzar un cambio de estado en el set actual."""
        ...

    @abc.abstractmethod
    async def create_next_set(self, session: Any, match_id: int, next_number: int) -> Optional[Any]:
        """Lógica para generar el siguiente set de un partido."""
        ...

    @abc.abstractmethod
    async def get_sets_by_team_id_and_league_id(self, session: Any, team_id: int, league_id: int) -> List[SetDTO]:
        """Lógica para obtener todos los sets en los que ha participado un equipo en una liga específica."""
        ...