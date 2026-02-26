from fastapi import APIRouter, Depends, HTTPException
from app.api.schemas.responses.team import TeamsResponse, TeamResponse
from app.core.container import container_instance

router = APIRouter()

def get_team_service():
    return container_instance.team_service()

@router.get("/{slug}/match", response_model=TeamsResponse)
async def get_teams_from_match(
    slug: str,
    service = Depends(get_team_service)
):
    async with container_instance.context_session() as session:
        teams_dtos = await service.get_match_teams(session, slug)
        
        if not teams_dtos:
            raise HTTPException(status_code=404, detail="No se encontraron equipos para este partido")
            
        return {
            "teams": [TeamResponse.from_dto(t) for t in teams_dtos]
        }