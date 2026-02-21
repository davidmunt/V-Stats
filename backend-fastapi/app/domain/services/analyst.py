import abc
from typing import List
from app.domain.dtos.analyst import AnalystDTO

class IAnalystService(abc.ABC):
    """Interfaz del servicio de Entrenadores (Business Logic)."""

    @abc.abstractmethod
    async def get_free_analysts(self) -> List[AnalystDTO]:
        """Lógica para obtener entrenadores sin equipo (id_team IS NULL)."""
        ...

    @abc.abstractmethod
    async def get_assigned_analysts(self) -> List[AnalystDTO]:
        """Lógica para obtener entrenadores con equipo (id_team IS NOT NULL)."""
        ...