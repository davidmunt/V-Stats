from typing import Optional
from app.domain.dtos.coach import CoachDTO
from app.domain.mapper import IModelMapper
from app.infrastructure.models.coach import Coach

class CoachModelMapper(IModelMapper[Coach, CoachDTO]):

    @staticmethod
    def to_dto(model: Coach) -> Optional[CoachDTO]:
        """
        Convierte el modelo de SQLAlchemy (Base de Datos) al DTO de Dominio.
        """
        if model is None:
            return None
            
        return CoachDTO(
            slug_coach=model.slug,
            slug_team=model.team.slug if hasattr(model, "team") and model.team else "none",
            name=model.name,
            email=model.email,
            avatar=model.avatar,
            id_coach=model.id_coach,
            id_team=model.id_team,
            user_type="coach",
            is_active=model.is_active,
            status=model.status
        )

    @staticmethod
    def from_dto(dto: CoachDTO) -> Optional[Coach]:
        """
        Convierte el DTO de Dominio al modelo de SQLAlchemy para persistencia.
        """
        if dto is None:
            return None

        model = Coach(
            slug=dto.slug_coach,
            name=dto.name,
            email=dto.email,
            avatar=dto.avatar,
            id_team=dto.id_team,
            status=dto.status if hasattr(dto, "status") else "active"
        )
        
        if hasattr(dto, "id_coach") and dto.id_coach is not None:
            model.id_coach = dto.id_coach
            
        return model