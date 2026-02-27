from fastapi import APIRouter, Depends, HTTPException
from app.api.dependencies.auth import RoleChecker
from app.api.schemas.responses.match import MatchResponse, MatchListResponse, SingleMatchResponse
from app.core.container import container_instance

router = APIRouter()

auth_any = RoleChecker(["admin", "coach", "analyst", "user"]) 

def get_match_service():
    return container_instance.match_service()
    
@router.get("/next", response_model=SingleMatchResponse)
async def get_my_next_match(
    user_data: dict = Depends(auth_any),
    service = Depends(get_match_service)
):
    user_email = user_data.get("sub")
    user_role = user_data.get("role")
    
    async with container_instance.context_session() as session:
        match_dto = await service.get_user_next_match(session, user_email, user_role)
        
        if not match_dto:
            raise HTTPException(status_code=404, detail="No upcoming matches found")
            
        match_data = MatchResponse.from_dto(match_dto)
        
        return {"match": match_data}

@router.get("/league/{slug}", response_model=MatchListResponse)
async def get_league_calendar(
    slug: str,
    user_data: dict = Depends(auth_any),
    service = Depends(get_match_service)
):
    """Cualquier usuario autenticado puede ver el calendario de una liga."""
    async with container_instance.context_session() as session:
        matches_dtos = await service.get_league_matches(session, slug)
        return MatchListResponse(
            matches=[MatchResponse.from_dto(m) for m in matches_dtos]
        )
    
@router.get("/team/{slug}", response_model=MatchListResponse)
async def get_league_calendar(
    slug: str,
    user_data: dict = Depends(auth_any),
    service = Depends(get_match_service)
):
    """Cualquier usuario autenticado puede ver el calendario de una liga."""
    async with container_instance.context_session() as session:
        matches_dtos = await service.get_matches_by_team(session, slug)
        return MatchListResponse(
            matches=[MatchResponse.from_dto(m) for m in matches_dtos]
        )
    
@router.patch("/{match_slug}/start")
async def start_match(
    match_slug: str,
    user_data: dict = Depends(auth_any),
    service = Depends(get_match_service)
):
    user_role = user_data.get("role")
    
    async with container_instance.context_session() as session:
        try:
            result = await service.start_match(session, match_slug, user_role)
            
            if result == "MATCH_NOT_FOUND":
                raise HTTPException(status_code=404, detail="Partido no encontrado")
            
            if result == "SET_NOT_FOUND":
                raise HTTPException(status_code=404, detail="No se encontró un set inicial para este partido")
                
            if "finalizado" in result:
                raise HTTPException(status_code=400, detail=result)

            return {"message": result, "status": "live"}

        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))