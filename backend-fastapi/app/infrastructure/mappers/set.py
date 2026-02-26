from typing import Optional
from app.domain.dtos.set import SetDTO
from app.domain.mapper import IModelMapper
from app.infrastructure.models.set import Set

class SetModelMapper(IModelMapper[Set, SetDTO]):

    @staticmethod
    def to_dto(model: Set) -> Optional[SetDTO]:
        """
        Convierte el modelo Set de SQLAlchemy al DTO de Dominio SetDTO.
        """
        if model is None:
            return None
            
        return SetDTO(
            slug_set=model.slug,
            slug_match=model.match.slug if model.match else "none",
            set_number=model.set_number,
            local_points=model.local_points,
            visitor_points=model.visitor_points,
            finished_at=model.finished_at.isoformat() if model.finished_at else None,
            status=model.status,
            is_active=model.is_active
        )

    @staticmethod
    def from_dto(dto: SetDTO) -> Optional[Set]:
        """
        Convierte el DTO SetDTO al modelo Set de SQLAlchemy.
        """
        if dto is None:
            return None

        model = Set(
            slug=dto.slug_set,
            set_number=dto.set_number,
            local_points=dto.local_points,
            visitor_points=dto.visitor_points,
            status=dto.status,
            is_active=dto.is_active
        )
        
        return model