from typing import Optional
from app.domain.dtos.league import LeagueDTO
from app.infrastructure.models.league import League

class LeagueModelMapper:
    @staticmethod
    def to_dto(model: League) -> Optional[LeagueDTO]:
        if model is None:
            return None
        
        return LeagueDTO(
            slug_league=model.slug,
            slug_category=model.category.slug if model.category else "no-cat",
            slug_admin=model.admin.slug if model.admin else "no-admin",
            name=model.name,
            country=model.country,
            season="2025-2026",
            image=model.image or "",
            is_active=model.is_active,
            status=model.status,
            id_league=model.id_league
        )