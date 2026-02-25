import abc
from typing import Any, Optional
from app.domain.dtos.team import TeamDTO

class ITeamRepository(abc.ABC):
    @abc.abstractmethod
    async def get_by_id(self, session: Any, id_team: int) -> Optional[TeamDTO]:
        ...