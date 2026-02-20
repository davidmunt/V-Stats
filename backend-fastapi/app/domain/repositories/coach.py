import abc
from typing import Any, List
from app.domain.dtos.coach import CoachDTO

class ICoachRepository(abc.ABC):
    """Interfaz del repositorio de Entrenadores."""

    @abc.abstractmethod
    async def get_by_slug(self, session: Any, slug: str) -> CoachDTO:
        ...

    @abc.abstractmethod
    async def get_by_id(self, session: Any, coach_id: int) -> CoachDTO:
        ...

    @abc.abstractmethod
    async def get_free_coaches(self, session: Any) -> List[CoachDTO]:
        """Obtiene entrenadores donde id_team es NULL."""
        ...

    @abc.abstractmethod
    async def get_assigned_coaches(self, session: Any) -> List[CoachDTO]:
        """Obtiene entrenadores donde id_team NO es NULL."""
        ...