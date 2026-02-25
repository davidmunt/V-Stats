from typing import Optional
from app.domain.dtos.match import MatchDTO
from app.domain.mapper import IModelMapper
from app.infrastructure.models.match import Match

class MatchModelMapper(IModelMapper[Match, MatchDTO]):

    @staticmethod
    def to_dto(model: Match) -> Optional[MatchDTO]:
        """
        Convierte el modelo Match de SQLAlchemy al DTO de Dominio MatchDTO.
        """
        if model is None:
            return None
            
        return MatchDTO(
            slug_match=model.slug,
            slug_league=model.league.slug if model.league else "none",
            slug_team_local=model.local_team.slug if model.local_team else "none",
            slug_team_visitor=model.visitor_team.slug if model.visitor_team else "none",
            slug_venue=model.venue.slug if model.venue else "none",
            name=f"{model.local_team.name} vs {model.visitor_team.name}" if model.local_team and model.visitor_team else "Unknown Match",
            image=model.league.image if model.league else "",
            country=model.league.country if model.league else "Unknown",
            date=model.date.isoformat() if model.date else "",
            current_set=model.current_set,
            is_active=model.is_active,
            status=model.status,
            id_league=model.id_league
        )

    @staticmethod
    def from_dto(dto: MatchDTO) -> Optional[Match]:
        """
        Convierte el DTO MatchDTO al modelo Match de SQLAlchemy para persistencia.
        """
        if dto is None:
            return None

        # Nota: La creación requiere IDs reales de base de datos para las FKs
        model = Match(
            slug=dto.slug_match,
            id_league=dto.id_league,
            date=dto.date, # Debería ser un objeto datetime al persistir
            current_set=dto.current_set,
            is_active=dto.is_active,
            status=dto.status
        )
        
        return model