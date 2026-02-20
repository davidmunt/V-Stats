from typing import List
from fastapi import APIRouter, Depends
from dependency_injector.wiring import inject, Provide

from app.api.schemas.responses.coach import CoachResponse
from app.core.container import Container
from app.domain.services.coach import ICoachService

router = APIRouter()

@router.get("/free", response_model=List[CoachResponse])
@inject
async def get_free_coaches(
    coach_service: ICoachService = Depends(Provide[Container.coach_service]),
    session_generator = Depends(Provide[Container.session]) # Inyectamos el generador de sesión
) -> List[CoachResponse]:
    
    # Obtenemos la sesión del generador
    async for session in session_generator:
        coaches_dtos = await coach_service.get_free_coaches(session)
        return [CoachResponse.from_dto(dto) for dto in coaches_dtos]

@router.get("/assigned", response_model=List[CoachResponse])
@inject
async def get_assigned_coaches(
    coach_service: ICoachService = Depends(Provide[Container.coach_service]),
    session_generator = Depends(Provide[Container.session])
) -> List[CoachResponse]:
    
    async for session in session_generator:
        coaches_dtos = await coach_service.get_assigned_coaches(session)
        return [CoachResponse.from_dto(dto) for dto in coaches_dtos]