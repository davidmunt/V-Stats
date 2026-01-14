from conduit.domain.dtos.prueba import PruebaRecordDTO
from conduit.domain.mapper import IModelMapper
from conduit.infrastructure.models.prueba import Prueba


class PruebaModelMapper(IModelMapper[Prueba, PruebaRecordDTO]):

    @staticmethod
    def to_dto(model: Prueba) -> PruebaRecordDTO:
        dto = PruebaRecordDTO(
            id_prueba=model.id_prueba,
            description=model.description,
        )
        return dto

    @staticmethod
    def from_dto(dto: PruebaRecordDTO) -> Prueba:
        model = Prueba(
            description=dto.description,
        )
        if hasattr(dto, "id_prueba"):
            model.id_prueba = dto.id_prueba
        return model
