from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies.auth import RoleChecker
from app.api.schemas.requests.action import ActionCreateRequest
from app.api.schemas.responses.action import SingleActionResponse, ActionResponse
from app.api.schemas.responses.set import SetResponse
from app.core.container import container_instance

router = APIRouter()

# Solo los analistas pueden registrar jugadas
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
            # Llamamos al service con los datos validados
            result = await service.create_action(
                session=session,
                set_slug=slug_set,
                data=payload.model_dump(),
                role=user_role
            )
            
            # Construimos la respuesta compleja
            return SingleActionResponse(
                action=ActionResponse.from_dto(result["action"]),
                new_set=SetResponse.from_dto(result["new_set"]) if result["new_set"] else None,
                match_finished=result["match_finished"]
            )

        except ValueError as e:
            # Errores de negocio (Set no encontrado, etc.)
            error_msg = str(e)
            if "NOT_FOUND" in error_msg:
                raise HTTPException(status_code=404, detail=error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
            
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))