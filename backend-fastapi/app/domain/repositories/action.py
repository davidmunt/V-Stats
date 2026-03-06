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

    @abc.abstractmethod
    async def get_last_point_by_team(self, session: Any, id_set: int, id_point_team: int) -> Optional[Any]:
        ...

    @abc.abstractmethod
    async def delete(self, session: Any, action_model: Any) -> None:
        ...

    @abc.abstractmethod
    async def get_actions_type_from_team(self, session: Any, id_team: int, action_type: str) -> list[Any]:
        """Obtiene todas las acciones de un tipo específico que han generado punto para un equipo."""
        ...

    @abc.abstractmethod
    async def get_actions_type_from_team_against_team(self, session: Any, id_team: int, action_type: str) -> list[Any]:
        """Obtiene todas las acciones de un tipo específico que han hecho punto contra otro equipo."""
        ...

    @abc.abstractmethod
    async def get_actions_type_from_player(self, session: Any, id_team: int, id_player: int, action_type: str) -> list[Any]:
        """Obtiene todas las acciones de un tipo específico que han generado punto para un jugador."""
        ...

    @abc.abstractmethod
    async def get_actions_type_from_player_against_team(self, session: Any, id_team: int, id_player: int, action_type: str) -> list[Any]:
        """Obtiene todas las acciones de un tipo específico que han hecho punto contra otro equipo para un jugador."""
        ...