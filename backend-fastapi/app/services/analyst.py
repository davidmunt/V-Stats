from typing import List
from app.domain.services.analyst import IAnalystService
from app.domain.repositories.analyst import IAnalystRepository
from app.domain.dtos.analyst import AnalystDTO

class AnalystService(IAnalystService):
    def __init__(self, analyst_repository: IAnalystRepository):
        self._analyst_repository = analyst_repository

    async def get_free_analysts(self, session) -> List[AnalystDTO]:
        return await self._analyst_repository.get_free_analysts(session)

    async def get_assigned_analysts(self, session) -> List[AnalystDTO]:
        return await self._analyst_repository.get_assigned_analysts(session)