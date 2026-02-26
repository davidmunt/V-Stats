import abc
from typing import Any, Optional
from app.domain.dtos.set import SetDTO

class ISetRepository(abc.ABC):
    """Interfaz del repositorio de Sets."""

    @abc.abstractmethod
    async def get_actual_set_by_match_slug(self, session: Any, match_slug: str) -> Optional[SetDTO]:
        """Obtiene el set con el set_number más alto para un partido específico."""
        ...