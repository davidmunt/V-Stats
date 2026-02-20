from typing import List
from app.domain.services.coach import ICoachService
from app.domain.repositories.coach import ICoachRepository
from app.domain.dtos.coach import CoachDTO

class CoachService(ICoachService):
    def __init__(self, coach_repository: ICoachRepository):
        self._coach_repository = coach_repository

    async def get_free_coaches(self, session) -> List[CoachDTO]:
        return await self._coach_repository.get_free_coaches(session)

    async def get_assigned_coaches(self, session) -> List[CoachDTO]:
        return await self._coach_repository.get_assigned_coaches(session)