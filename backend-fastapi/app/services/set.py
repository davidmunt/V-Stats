from typing import Optional
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
        print(f"🚀 DEBUG: Buscando set actual para el partido: {match_slug}")
        
        # Llamamos al repositorio que ya tiene la lógica de ordenar por número de set
        actual_set = await self._set_repository.get_actual_set_by_match_slug(session, match_slug)
        
        if not actual_set:
            print(f"⚠️ DEBUG: No se encontraron sets para el partido: {match_slug}")
            return None
            
        print(f"✅ DEBUG: Set encontrado: {actual_set.slug_set} (Número {actual_set.set_number})")
        return actual_set