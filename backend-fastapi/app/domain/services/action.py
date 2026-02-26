import abc
from typing import Any, Optional
from app.domain.dtos.action import ActionDTO

class IActionService(abc.ABC):
    """Interfaz para la lógica de negocio de las jugadas (Acciones)."""

    @abc.abstractmethod
    async def create_action(
        self, 
        session: Any, 
        set_slug: str, 
        action_data: dict, 
        role: str
    ) -> dict:
        """
        Procesa una jugada completa:
        1. Valida permisos del analista.
        2. Registra la acción.
        3. Gestiona rotaciones si hay cambio de saque.
        4. Actualiza marcador y gestiona cierre de sets/partido.
        """
        ...