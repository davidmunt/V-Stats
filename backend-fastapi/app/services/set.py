from typing import Any, List, Optional
from app.domain.services.set import ISetService
from app.domain.repositories.set import ISetRepository
from app.domain.dtos.set import SetDTO

class SetService(ISetService):
    def __init__(self, set_repository: ISetRepository):
        """
        Inyectamos solo el repositorio de sets.
        """
        self._set_repository = set_repository

    async def get_actual_set(self, session, match_slug: str) -> Optional[SetDTO]:
        """
        Lógica para obtener el set con el set_number más alto de un partido.
        """
        actual_set = await self._set_repository.get_actual_set_by_match_slug(session, match_slug)
        if not actual_set:
            return None
        return actual_set
    
    async def get_finished_sets(self, session, match_slug: str) -> List[SetDTO]:
        """Obtiene la colección de sets cuyo estado es 'finished'."""
        return await self._set_repository.get_finished_sets_by_match_slug(session, match_slug)
    
    async def update_actual_set_status(self, session: Any, match_slug: str, new_status: str) -> None:
        """
        Implementación del método abstracto para actualizar el estado del set actual.
        """
        set_model = await self._set_repository.get_actual_set_model_by_match_slug(session, match_slug)
        if set_model:
            await self._set_repository.update_set_status(session, set_model, new_status)