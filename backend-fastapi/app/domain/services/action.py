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

    @abc.abstractmethod
    async def delete_last_team_point(self, session: Any, set_slug: str, team_slug: str, role: str) -> bool:
        """
        Lógica para eliminar la última acción de punto de un equipo 
        y restar el punto del marcador del set.
        """
        ...

    @abc.abstractmethod
    async def make_substitution(
        self, 
        session: Any, 
        slug_lineup: str, 
        slug_player_out: str, 
        slug_player_in: str, 
        role: str
    ) -> bool:
        """
        Lógica para validar e intercambiar jugadores en pista.
        """
        ...

    @abc.abstractmethod
    async def get_actions_type_from_team(self, session: Any, team_slug: str, action_type: str) -> list[ActionDTO]:
        """
        Lógica para obtener todas las acciones de un tipo de un equipo específico que han generado punto.
        """
        ...

    @abc.abstractmethod
    async def get_actions_type_from_team_against_team(self, session: Any, team_slug: str, action_type: str) -> list[ActionDTO]:
        """
        Lógica para obtener todas las acciones de un tipo de un equipo especifico que han hecho punto contra otro equipod.
        """
        ...

    @abc.abstractmethod
    async def get_actions_type_from_player(self, session: Any, player_slug: str, action_type: str) -> list[ActionDTO]:
        """
        Lógica para obtener todas las acciones de un tipo de un jugador específico que han generado punto.
        """
        ...

    @abc.abstractmethod
    async def get_actions_type_from_player_against_team(self, session: Any, player_slug: str, action_type: str) -> list[ActionDTO]:
        """
        Lógica para obtener todas las acciones de un tipo de un jugador específico que han hecho punto contra otro equipo.
        """
        ...

    # @abc.abstractmethod
    # async def get_general_actions_from_team(self, session: Any, team_slug: str) -> list[ActionDTO]:
    #     """
    #     Lógica para obtener datos en general de un equipo como: total de puntos, porcentaje de acierto, etc.
    #     """
    #     ...