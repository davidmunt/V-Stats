import abc
from typing import Any, List
from app.domain.dtos.analyst import AnalystDTO

class IAnalystRepository(abc.ABC):
    """Interfaz del repositorio de Analistas."""

    @abc.abstractmethod
    async def get_by_slug(self, session: Any, slug: str) -> AnalystDTO:
        ...

    @abc.abstractmethod
    async def get_by_id(self, session: Any, analyst_id: int) -> AnalystDTO:
        ...

    @abc.abstractmethod
    async def get_free_analysts(self, session: Any) -> List[AnalystDTO]:
        """Obtiene analistas donde id_team es NULL."""
        ...

    @abc.abstractmethod
    async def get_assigned_analysts(self, session: Any) -> List[AnalystDTO]:
        """Obtiene analistas donde id_team NO es NULL."""
        ...