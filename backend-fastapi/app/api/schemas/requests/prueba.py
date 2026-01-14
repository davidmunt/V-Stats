from pydantic import BaseModel, Field

from app.domain.dtos.prueba import CreatePruebaDTO

class CreatePruebaData(BaseModel):
    description: str = Field(..., min_length=1)


class CreatePruebaRequest(BaseModel):
    prueba: CreatePruebaData

    def to_dto(self) -> CreatePruebaDTO:
        return CreatePruebaDTO(
            description=self.prueba.description
        )
