from fastapi import APIRouter, Depends, HTTPException
from app.api.dependencies.auth import RoleChecker
from app.api.schemas.responses.set import SetResponse, SingleSetResponse, SetsListResponse
from app.core.container import container_instance

router = APIRouter()

auth_any = RoleChecker(["admin", "coach", "analyst", "user"])

def get_set_service():
    return container_instance.set_service()

@router.get("/set-match/{slug}", response_model=SingleSetResponse)
async def get_actual_set_from_match(
    slug: str,
    user_data: dict = Depends(auth_any),
    service = Depends(get_set_service)
):
    """
    Obtiene el set actual (el número más alto) de un partido específico.
    """
    async with container_instance.context_session() as session:
        set_dto = await service.get_actual_set(session, slug)
        
        if not set_dto:
            raise HTTPException(
                status_code=404, 
                detail=f"No sets found for match with slug: {slug}"
            )
            
        return {
            "set": SetResponse.from_dto(set_dto)
        }
    
@router.get("/finished/{slug}", response_model=SetsListResponse)
async def get_finished_sets_from_match(
    slug: str,
    user_data: dict = Depends(auth_any),
    service = Depends(get_set_service)
):
    """Obtiene todos los sets finalizados de un partido."""
    async with container_instance.context_session() as session:
        sets_dtos = await service.get_finished_sets(session, slug)
        return {
            "sets": [SetResponse.from_dto(s) for s in sets_dtos]
        }