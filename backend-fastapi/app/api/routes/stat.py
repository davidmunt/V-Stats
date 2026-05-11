from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies.auth import RoleChecker
from app.api.schemas.responses.stat import StatResponse, StatsResponse
from app.api.schemas.responses.stat_general import (
    StatGeneralResponse,
    StatsGeneralResponse,
    TeamActionResultBreakdownResponse,
    PlayerActionResultBreakdownResponse,
    TeamActionResultBreakdownByMatchResponse,
    PlayerActionResultBreakdownByMatchResponse,
)
from app.api.schemas.responses.set import SetResponse
from app.core.container import container_instance

router = APIRouter()

auth_analyst = RoleChecker(["coach", "analyst"])

def get_action_service():
    return container_instance.action_service()

@router.get("/team/{team_slug}/type/{action_type}", response_model=StatsResponse)
async def get_actions_by_team_and_type(
    team_slug: str,
    action_type: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene todas las acciones de un tipo específico que han generado punto para un equipo.
    """
    async with container_instance.context_session() as session:
        try:
            actions_dtos = await service.get_actions_type_from_team(session, team_slug, action_type, user_data.get("sub"), user_data.get("role"))
            stats_list = [StatResponse.from_dto(a) for a in actions_dtos]
            return StatsResponse(stats=stats_list)

        except ValueError as e:
            error_msg = str(e)
            if "TEAM_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
            
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))

@router.get("/team/{team_slug}/type/{action_type}/against", response_model=StatsResponse)
async def get_actions_by_team_and_type_against_team(
    team_slug: str,
    action_type: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene todas las acciones de un tipo específico realizadas POR OTROS equipos
    donde el punto fue CONTRA el equipo indicado.
    """
    async with container_instance.context_session() as session:
        try:
            actions_dtos = await service.get_actions_type_from_team_against_team(session, team_slug, action_type, user_data.get("sub"), user_data.get("role"))
            stats_list = [StatResponse.from_dto(a) for a in actions_dtos]
            return StatsResponse(stats=stats_list)

        except ValueError as e:
            error_msg = str(e)
            if "TEAM_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))

@router.get("/player/{player_slug}/type/{action_type}", response_model=StatsResponse)
async def get_actions_by_player_and_type(
    player_slug: str,
    action_type: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene todas las acciones de un tipo específico que han generado punto para un jugador específico.
    """
    async with container_instance.context_session() as session:
        try:
            actions_dtos = await service.get_actions_type_from_player(session, player_slug, action_type, user_data.get("sub"), user_data.get("role"))
            stats_list = [StatResponse.from_dto(a) for a in actions_dtos]
            return StatsResponse(stats=stats_list)

        except ValueError as e:
            error_msg = str(e)
            if "PLAYER_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))

@router.get("/player/{player_slug}/type/{action_type}/against", response_model=StatsResponse)
async def get_actions_by_player_and_type_against_team(
    player_slug: str,
    action_type: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene todas las acciones de un tipo específico de un jugador que resultaron en punto para el rival.
    """
    async with container_instance.context_session() as session:
        try:
            actions_dtos = await service.get_actions_type_from_player_against_team(session, player_slug, action_type, user_data.get("sub"), user_data.get("role"))
            stats_list = [StatResponse.from_dto(a) for a in actions_dtos]
            return StatsResponse(stats=stats_list)

        except ValueError as e:
            error_msg = str(e)
            if "PLAYER_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))

@router.get("/team/{team_slug}/general", response_model=StatGeneralResponse) 
async def get_general_stats_by_team(
    team_slug: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene estadísticas generales de un equipo como un objeto único.
    """
    async with container_instance.context_session() as session:
        try:
            stats_dto = await service.get_general_stats_by_team(session, team_slug, user_data.get("sub"), user_data.get("role"))
            return StatGeneralResponse.from_dto(stats_dto)

        except ValueError as e:
            error_msg = str(e)
            if "TEAM_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)

@router.get("/team/{team_slug}/action-results", response_model=TeamActionResultBreakdownResponse)
async def get_action_result_breakdown_by_team(
    team_slug: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene, por tipo de acción, los porcentajes de resultados ++, +, -, -- para un equipo.
    """
    async with container_instance.context_session() as session:
        try:
            stats_dto = await service.get_action_result_breakdown_by_team(
                session,
                team_slug,
                user_data.get("sub"),
                user_data.get("role"),
            )
            return TeamActionResultBreakdownResponse.from_dto(stats_dto)

        except ValueError as e:
            error_msg = str(e)
            if "TEAM_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))


@router.get("/player/{player_slug}/action-results", response_model=PlayerActionResultBreakdownResponse)
async def get_action_result_breakdown_by_player(
    player_slug: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene, por tipo de acción, los porcentajes de resultados ++, +, -, -- para un jugador.
    """
    async with container_instance.context_session() as session:
        try:
            stats_dto = await service.get_action_result_breakdown_by_player(
                session,
                player_slug,
                user_data.get("sub"),
                user_data.get("role"),
            )
            return PlayerActionResultBreakdownResponse.from_dto(stats_dto)

        except ValueError as e:
            error_msg = str(e)
            if "PLAYER_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))


@router.get("/team/{team_slug}/action-results/match/{match_slug}", response_model=TeamActionResultBreakdownByMatchResponse)
async def get_action_result_breakdown_by_team_match(
    team_slug: str,
    match_slug: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene, por tipo de acción, los porcentajes de resultados ++, +, -, -- para un equipo en un partido concreto.
    """
    async with container_instance.context_session() as session:
        try:
            stats_dto = await service.get_action_result_breakdown_by_team_match(
                session,
                team_slug,
                match_slug,
                user_data.get("sub"),
                user_data.get("role"),
            )
            return TeamActionResultBreakdownByMatchResponse.from_dto(stats_dto)

        except ValueError as e:
            error_msg = str(e)
            if "TEAM_NOT_FOUND" in error_msg or "MATCH_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))


@router.get("/player/{player_slug}/action-results/match/{match_slug}", response_model=PlayerActionResultBreakdownByMatchResponse)
async def get_action_result_breakdown_by_player_match(
    player_slug: str,
    match_slug: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene, por tipo de acción, los porcentajes de resultados ++, +, -, -- para un jugador en un partido concreto.
    """
    async with container_instance.context_session() as session:
        try:
            stats_dto = await service.get_action_result_breakdown_by_player_match(
                session,
                player_slug,
                match_slug,
                user_data.get("sub"),
                user_data.get("role"),
            )
            return PlayerActionResultBreakdownByMatchResponse.from_dto(stats_dto)

        except ValueError as e:
            error_msg = str(e)
            if "PLAYER_NOT_FOUND" in error_msg or "MATCH_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))

@router.get("/team/{team_slug}/type/{action_type}/match/{match_slug}", response_model=StatsResponse)
async def get_actions_type_from_team_match_team(
    team_slug: str,
    action_type: str,
    match_slug: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene todas las acciones de un tipo específico que ha generado un equipo en un partido específico.
    """
    async with container_instance.context_session() as session:
        try:
            actions_dtos = await service.get_actions_type_from_team_match_team(session, team_slug, action_type, match_slug)
            stats_list = [StatResponse.from_dto(a) for a in actions_dtos]
            return StatsResponse(stats=stats_list)

        except ValueError as e:
            error_msg = str(e)
            if "TEAM_NOT_FOUND" in error_msg or "MATCH_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))

@router.get("/team/{team_slug}/type/{action_type}/match/{match_slug}/against", response_model=StatsResponse)
async def get_actions_type_from_team_match_against_team(
    team_slug: str,
    action_type: str,
    match_slug: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene todas las acciones de un tipo específico realizadas POR OTROS equipos
    donde el punto fue CONTRA el equipo indicado en un partido específico.
    """
    async with container_instance.context_session() as session:
        try:
            actions_dtos = await service.get_actions_type_from_team_match_against_team(session, team_slug, action_type, match_slug)
            stats_list = [StatResponse.from_dto(a) for a in actions_dtos]
            return StatsResponse(stats=stats_list)

        except ValueError as e:
            error_msg = str(e)
            if "TEAM_NOT_FOUND" in error_msg or "MATCH_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))
        
@router.get("/player/{player_slug}/type/{action_type}/match/{match_slug}", response_model=StatsResponse)
async def get_actions_type_from_player_match_team(
    player_slug: str,
    action_type: str,
    match_slug: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene todas las acciones de un tipo específico que ha generado un jugador en un partido específico.
    """
    async with container_instance.context_session() as session:
        try:
            actions_dtos = await service.get_actions_type_from_player_match_team(session, player_slug, action_type, match_slug)
            stats_list = [StatResponse.from_dto(a) for a in actions_dtos]
            return StatsResponse(stats=stats_list)

        except ValueError as e:
            error_msg = str(e)
            if "PLAYER_NOT_FOUND" in error_msg or "MATCH_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))
        
@router.get("/player/{player_slug}/type/{action_type}/match/{match_slug}/against", response_model=StatsResponse)
async def get_actions_type_from_player_match_against_team(
    player_slug: str,
    action_type: str,
    match_slug: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene todas las acciones de un tipo específico de un jugador que resultaron en punto para el rival en un partido específico.
    """
    async with container_instance.context_session() as session:
        try:
            actions_dtos = await service.get_actions_type_from_player_match_against_team(session, player_slug, action_type, match_slug)
            stats_list = [StatResponse.from_dto(a) for a in actions_dtos]
            return StatsResponse(stats=stats_list)

        except ValueError as e:
            error_msg = str(e)
            if "PLAYER_NOT_FOUND" in error_msg or "MATCH_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))
        
@router.get("/team/{team_slug}/chart", response_model=TeamActionResultBreakdownResponse) 
async def get_chart_stats_by_team(
    team_slug: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene estadísticas generales de un equipo como un objeto único.
    """
    async with container_instance.context_session() as session:
        try:
            stats_dto = await service.get_action_result_breakdown_by_team(session, team_slug, user_data.get("sub"), user_data.get("role"))
            return TeamActionResultBreakdownResponse.from_dto(stats_dto)

        except ValueError as e:
            error_msg = str(e)
            if "TEAM_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)

@router.get("/player/{player_slug}/chart", response_model=PlayerActionResultBreakdownResponse) 
async def get_chart_stats_by_player(
    player_slug: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene estadísticas generales de un jugador como un objeto único.
    """
    async with container_instance.context_session() as session:
        try:
            stats_dto = await service.get_action_result_breakdown_by_player(session, player_slug, user_data.get("sub"), user_data.get("role"))
            return PlayerActionResultBreakdownResponse.from_dto(stats_dto)

        except ValueError as e:
            error_msg = str(e)
            if "PLAYER_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)

@router.get("/team/{team_slug}/match/{match_slug}/chart", response_model=TeamActionResultBreakdownByMatchResponse) 
async def get_chart_stats_by_team_match(
    team_slug: str,
    match_slug: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene estadísticas generales de un equipo como un objeto único.
    """
    async with container_instance.context_session() as session:
        try:
            stats_dto = await service.get_action_result_breakdown_by_team_match(session, team_slug, match_slug, user_data.get("sub"), user_data.get("role"))
            return TeamActionResultBreakdownByMatchResponse.from_dto(stats_dto)

        except ValueError as e:
            error_msg = str(e)
            if "TEAM_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)

@router.get("/player/{player_slug}/match/{match_slug}/chart", response_model=PlayerActionResultBreakdownByMatchResponse) 
async def get_chart_stats_by_player_match(
    player_slug: str,
    match_slug: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Obtiene estadísticas generales de un jugador como un objeto único.
    """
    async with container_instance.context_session() as session:
        try:
            stats_dto = await service.get_action_result_breakdown_by_player_match(session, player_slug, match_slug, user_data.get("sub"), user_data.get("role"))
            return PlayerActionResultBreakdownByMatchResponse.from_dto(stats_dto)

        except ValueError as e:
            error_msg = str(e)
            if "PLAYER_NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)