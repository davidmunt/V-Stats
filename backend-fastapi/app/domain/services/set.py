import abc
from typing import Any, Optional
from app.domain.dtos.set import SetDTO

class ISetService(abc.ABC):
    """Interfaz del servicio de Sets (Business Logic)."""

    @abc.abstractmethod
    async def get_actual_set(self, session: Any, match_slug: str) -> Optional[SetDTO]:
        """Lógica para obtener el set actual de un partido mediante su slug."""
        ...