from pydantic import BaseModel

from app.domain.dtos.prueba import PruebaDTO


class PruebaResponse(BaseModel):
    id_prueba: int
    description: str

    @classmethod
    def from_dto(cls, dto: PruebaDTO) -> "PruebaResponse":
        return cls(
            id_prueba=dto.id_prueba,
            description=dto.description
        )
