import abc
from typing import Any, Optional
from app.domain.dtos.league import LeagueDTO

class ILeagueRepository(abc.ABC):
    @abc.abstractmethod
    async def get_league_by_coach_email(self, session: Any, email: str) -> Optional[LeagueDTO]:
        """Obtiene la liga actual uniendo Coach -> SeasonTeam -> League."""
        ...

    @abc.abstractmethod
    async def get_league_id_by_slug(self, session: Any, slug: str) -> Optional[int]:
        """Obtiene el ID de una liga a partir de su slug."""
        ...