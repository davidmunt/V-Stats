from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies.auth import RoleChecker
from app.api.schemas.requests.action import ActionCreateRequest, SubstitutionCreateRequest
from app.api.schemas.responses.action import SingleActionResponse, ActionResponse
from app.api.schemas.responses.set import SetResponse
from app.core.container import container_instance

router = APIRouter()

auth_analyst = RoleChecker(["analyst"])

def get_action_service():
    return container_instance.action_service()

@router.post("/set/{slug_set}", response_model=SingleActionResponse, status_code=status.HTTP_201_CREATED)
async def create_new_action(
    slug_set: str,
    payload: ActionCreateRequest,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Registra una nueva acción de juego.
    Calcula puntos, rotaciones y posibles cierres de set/match.
    """
    user_role = user_data.get("role")
    
    async with container_instance.context_session() as session:
        try:
            result = await service.create_action(
                session=session,
                set_slug=slug_set,
                data=payload.model_dump(),
                role=user_role
            )
            
            return SingleActionResponse(
                action=ActionResponse.from_dto(result["action"]),
                new_set=SetResponse.from_dto(result["new_set"]) if result["new_set"] else None,
                match_finished=result["match_finished"]
            )

        except ValueError as e:
            error_msg = str(e)
            if "NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
            
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))
        
@router.post("/substitute", status_code=status.HTTP_204_NO_CONTENT)
async def create_substitution(
    payload: SubstitutionCreateRequest,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Realiza una sustitución de jugadores en una alineación activa.
    Intercambia al jugador en pista (1-6) por uno del banquillo (7).
    """
    async with container_instance.context_session() as session:
        try:
            await service.make_substitution(
                session=session,
                slug_lineup=payload.slug_lineup,
                slug_player_out=payload.slug_player_out,
                slug_player_in=payload.slug_player_in,
                role=user_data.get("role")
            )
            return None
            
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))
        
@router.delete("/set/{slug_set}/{team_slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_last_action_point(
    slug_set: str,
    team_slug: str,
    user_data: dict = Depends(auth_analyst),
    service = Depends(get_action_service)
):
    """
    Elimina la última jugada de punto de un equipo y descuenta el punto del marcador.
    """
    async with container_instance.context_session() as session:
        try:
            await service.delete_last_team_point(
                session=session,
                set_slug=slug_set,
                team_slug=team_slug,
                role=user_data.get("role")
            )
            return None 
            
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))