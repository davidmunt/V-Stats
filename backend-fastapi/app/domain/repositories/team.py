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