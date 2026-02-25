from typing import Optional
from app.domain.dtos.team import TeamDTO
from app.infrastructure.models.team import Team

class TeamModelMapper:
    @staticmethod
    def to_dto(model: Team, id_league: Optional[int] = None) -> Optional[TeamDTO]:
        if model is None:
            return None
        return TeamDTO(
            id_team=model.id_team,
            name=model.name,
            slug=model.slug,
            image=model.image,
            id_league=id_league
        )