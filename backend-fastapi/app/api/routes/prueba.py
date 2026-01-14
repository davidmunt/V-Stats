from fastapi import APIRouter

from app.api.schemas.requests.prueba import CreatePruebaRequest
from app.api.schemas.responses.prueba import PruebaResponse
from app.domain.dtos.prueba import PruebaDTO

router = APIRouter()


@router.post("", response_model=PruebaResponse)
async def create_prueba(payload: CreatePruebaRequest) -> PruebaResponse:
    """
    Endpoint de prueba para crear una Prueba.
    """
    # Simulación temporal (más adelante vendrá el servicio + DB)
    prueba_dto = PruebaDTO(
        id_prueba=1,
        description=payload.to_dto().description
    )

    return PruebaResponse.from_dto(prueba_dto)
