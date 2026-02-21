from typing import List
from fastapi import APIRouter, Depends
from app.api.schemas.responses.analyst import AnalystResponse, AnalystsListResponse
from app.core.container import container_instance 

router = APIRouter()

def get_analyst_service():
    return container_instance.analyst_service()

@router.get("/free", response_model=AnalystsListResponse) 
async def get_free_analysts(
    service = Depends(get_analyst_service)
) -> AnalystsListResponse:
    async with container_instance.context_session() as session:
        dtos = await service.get_free_analysts(session)
        return AnalystsListResponse(
            analysts=[AnalystResponse.from_dto(d) for d in dtos]
        )

@router.get("/assigned", response_model=AnalystsListResponse)
async def get_assigned_analysts(
    service = Depends(get_analyst_service)
) -> AnalystsListResponse:
    async with container_instance.context_session() as session:
        dtos = await service.get_assigned_analysts(session)
        return AnalystsListResponse(
            analysts=[AnalystResponse.from_dto(d) for d in dtos]
        )