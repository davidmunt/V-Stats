import abc
from typing import Any, List, Optional
from app.domain.dtos.analyst import AnalystDTO
from app.infrastructure.models.analyst import Analyst

class IAnalystRepository(abc.ABC):
    """Interfaz del repositorio de Analistas."""

    @abc.abstractmethod
    async def get_by_slug(self, session: Any, slug: str) -> AnalystDTO:
        ...

    @abc.abstractmethod
    async def get_by_id(self, session: Any, analyst_id: int) -> AnalystDTO:
        ...

    @abc.abstractmethod
    async def get_by_email(self, session: Any, email: str) -> Optional[AnalystDTO]:
        ...

    @abc.abstractmethod
    async def get_free_analysts(self, session: Any) -> List[AnalystDTO]:
        """Obtiene analistas donde id_team es NULL."""
        ...

    @abc.abstractmethod
    async def get_assigned_analysts(self, session: Any) -> List[AnalystDTO]:
        """Obtiene analistas donde id_team NO es NULL."""
        ...

    @abc.abstractmethod
    async def get_by_team_id(self, session: Any, team_id: int) -> Optional[Analyst]:
        """Obtiene el analista asignado a un equipo específico."""
        ...
