import abc
from typing import Any, List, Optional

class ILineupRepository(abc.ABC):
    @abc.abstractmethod
    async def get_active_lineup_by_team_and_match(self, session: Any, id_match: int, id_team: int) -> Optional[Any]:
        """Obtiene la alineación activa de un equipo en un partido."""
        ...

    @abc.abstractmethod
    async def get_court_positions(self, session: Any, id_lineup: int) -> List[Any]:
        """Obtiene los modelos de posición 1 a 6 en pista."""
        ...

    @abc.abstractmethod
    async def update_position(self, session: Any, position_model: Any, new_pos: int) -> None:
        """Actualiza la posición actual de un jugador en la rotación."""
        ...

    @abc.abstractmethod
    async def get_position_by_player_slug(self, session: Any, id_lineup: int, player_slug: str) -> Optional[Any]:
        ...

    @abc.abstractmethod
    async def execute_substitution(self, session: Any, pos_out: Any, pos_in: Any) -> None:
        ...
        
    @abc.abstractmethod
    async def get_by_slug_model(self, session: Any, slug: str) -> Optional[Any]:
        """Necesitaremos buscar el Lineup por su slug."""
        ...

    @abc.abstractmethod
    async def get_by_slug_model(self, session: Any, slug: str) -> Optional[Any]:
        """Busca el modelo de alineación para validar existencia."""
        ...