import abc
from typing import Any, List, Optional
from app.domain.dtos.set import SetDTO

class ISetRepository(abc.ABC):
    """Interfaz del repositorio de Sets."""

    @abc.abstractmethod
    async def get_actual_set_by_match_slug(self, session: Any, match_slug: str) -> Optional[SetDTO]:
        """Obtiene el set con el set_number más alto para un partido específico."""
        ...

    @abc.abstractmethod
    async def get_finished_sets_by_match_slug(self, session: Any, match_slug: str) -> List[SetDTO]:
        """Obtiene la lista de sets finalizados de un partido."""
        ...

    @abc.abstractmethod
    async def get_actual_set_model_by_match_slug(self, session: Any, match_slug: str) -> Optional[Any]:
        """Obtiene el modelo SQLAlchemy del set actual para poder modificarlo."""
        ...

    @abc.abstractmethod
    async def update_set_status(self, session: Any, set_model: Any, new_status: str) -> None:
        """Actualiza el estado de un modelo de set específico."""
        ...

    @abc.abstractmethod
    async def create_set(self, session: Any, set_model: Any) -> Any:
        """Crea un nuevo set en la base de datos."""
        ...

    @abc.abstractmethod
    async def create_next_set(self, session: Any, match_id: int, next_number: int) -> Optional[SetDTO]:
        """Crea un nuevo set y devuelve su DTO."""
        ...

    @abc.abstractmethod
    async def subtract_point(self, session: Any, set_model: Any, is_local: bool) -> None:
        ...