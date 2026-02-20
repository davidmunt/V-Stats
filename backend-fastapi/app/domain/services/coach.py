import abc
from typing import List
from app.domain.dtos.coach import CoachDTO

class ICoachService(abc.ABC):
    """Interfaz del servicio de Entrenadores (Business Logic)."""

    @abc.abstractmethod
    async def get_free_coaches(self) -> List[CoachDTO]:
        """Lógica para obtener entrenadores sin equipo (id_team IS NULL)."""
        ...

    @abc.abstractmethod
    async def get_assigned_coaches(self) -> List[CoachDTO]:
        """Lógica para obtener entrenadores con equipo (id_team IS NOT NULL)."""
        ...