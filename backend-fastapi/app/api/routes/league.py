from fastapi import APIRouter, Depends
from app.api.dependencies.auth import RoleChecker
from app.api.schemas.responses.league import LeagueResponse
from app.core.container import container_instance

router = APIRouter()

auth_required = RoleChecker(["coach", "analyst"])

def get_league_service():
    return container_instance.league_service()

@router.get("/my-league", response_model=LeagueResponse)
async def get_my_current_league(
    user_data: dict = Depends(auth_required),
    service = Depends(get_league_service)
):
    user_email = user_data.get("sub")
    user_role = user_data.get("role")
    
    async with container_instance.context_session() as session:
        league_dto = await service.get_league_by_user_email(session, user_email, user_role)
        return LeagueResponse.from_dto(league_dto)