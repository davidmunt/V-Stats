import abc
from typing import Any, List, Optional
from app.domain.dtos.team import TeamDTO

class ITeamRepository(abc.ABC):
    @abc.abstractmethod
    async def get_by_id(self, session: Any, id_team: int) -> Optional[TeamDTO]:
        ...

    @abc.abstractmethod
    async def get_teams_by_match_slug(self, session: Any, match_slug: str) -> List[TeamDTO]:
        """Nueva funcionalidad para obtener los equipos de un partido específico."""
        ...

    @abc.abstractmethod
    async def get_by_slug(self, session: Any, slug: str) -> Optional[TeamDTO]:
        """Obtiene un equipo por su slug para obtener su ID."""
        ...

    @abc.abstractmethod
    async def get_by_league_id(self, session: Any, id_league: int) -> List[TeamDTO]:
        """Obtiene todos los equipos de una liga específica."""
        ...