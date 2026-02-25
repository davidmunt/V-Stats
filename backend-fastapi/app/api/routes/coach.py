from typing import List
from fastapi import APIRouter, Depends
from app.api.dependencies.auth import RoleChecker
from app.api.schemas.responses.coach import CoachResponse, CoachesListResponse
from app.core.container import container_instance 

router = APIRouter()

def get_coach_service():
    return container_instance.coach_service()

@router.get("/free", response_model=CoachesListResponse) 
async def get_free_coaches(
    service = Depends(get_coach_service)
) -> CoachesListResponse:
    async with container_instance.context_session() as session:
        dtos = await service.get_free_coaches(session)
        return CoachesListResponse(
            coaches=[CoachResponse.from_dto(d) for d in dtos]
        )

@router.get("/assigned", response_model=CoachesListResponse)
async def get_assigned_coaches(
    service = Depends(get_coach_service)
) -> CoachesListResponse:
    async with container_instance.context_session() as session:
        dtos = await service.get_assigned_coaches(session)
        return CoachesListResponse(
            coaches=[CoachResponse.from_dto(d) for d in dtos]
        )