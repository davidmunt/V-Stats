from typing import Optional
from app.domain.dtos.analyst import AnalystDTO
from app.domain.mapper import IModelMapper
from app.infrastructure.models.analyst import Analyst

class AnalystModelMapper(IModelMapper[Analyst, AnalystDTO]):

    @staticmethod
    def to_dto(model: Analyst) -> Optional[AnalystDTO]:
        """
        Convierte el modelo de SQLAlchemy (Base de Datos) al DTO de Dominio.
        """
        if model is None:
            return None
            
        return AnalystDTO(
            slug_analyst=model.slug,
            slug_team=model.team.slug if hasattr(model, "team") and model.team else "none",
            name=model.name,
            email=model.email,
            avatar=model.avatar,
            id_analyst=model.id_analyst,
            id_team=model.id_team,
            user_type="analyst",
            is_active=model.is_active,
            status=model.status
        )

    @staticmethod
    def from_dto(dto: AnalystDTO) -> Optional[Analyst]:
        """
        Convierte el DTO de Dominio al modelo de SQLAlchemy para persistencia.
        """
        if dto is None:
            return None

        model = Analyst(
            slug=dto.slug_analyst,
            name=dto.name,
            email=dto.email,
            avatar=dto.avatar,
            id_team=dto.id_team,
            status=dto.status if hasattr(dto, "status") else "active"
        )
        
        if hasattr(dto, "id_analyst") and dto.id_analyst is not None:
            model.id_analyst = dto.id_analyst
            
        return model