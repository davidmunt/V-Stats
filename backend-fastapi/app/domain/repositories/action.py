import abc
from typing import Any, Optional
from app.domain.dtos.action import ActionDTO

class IActionRepository(abc.ABC):
    @abc.abstractmethod
    async def create(self, session: Any, action_model: Any) -> ActionDTO:
        """Persiste una nueva acción en la base de datos."""
        ...

    @abc.abstractmethod
    async def get_last_point_action(self, session: Any, id_set: int) -> Optional[Any]:
        """Busca la última acción que generó un punto para la lógica de rotación."""
        ...