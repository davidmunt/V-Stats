import abc
from typing import Any, Optional
from app.domain.dtos.player import PlayerDTO

class IPlayerRepository(abc.ABC):
    @abc.abstractmethod
    async def get_by_slug(self, session: Any, slug: str) -> Optional[PlayerDTO]:
        """Obtiene un jugador por su slug."""
        ... 