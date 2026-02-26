from typing import Optional, Union
from app.domain.dtos.team import TeamDTO
from app.infrastructure.models.team import Team
from app.infrastructure.models.season_team import SeasonTeam
from app.domain.mapper import IModelMapper

class TeamModelMapper(IModelMapper[Union[Team, SeasonTeam], TeamDTO]):
    @staticmethod
    def to_dto(model: Union[Team, SeasonTeam], id_league: Optional[int] = None) -> Optional[TeamDTO]:
        if model is None:
            return None

        # CASO 1: Si recibimos SeasonTeam (Listado desde el partido)
        if isinstance(model, SeasonTeam):
            return TeamDTO(
                slug_team=model.team.slug, # Usamos slug_team
                slug_league=model.league.slug if model.league else "none",
                name=model.team.name,
                slug_venue=model.venue.slug if model.venue else "none",
                slug_coach=model.coach.slug if model.coach else None,
                slug_analyst=model.analyst.slug if model.analyst else None,
                image=model.team.image or "",
                created_at=model.created_at,
                status=model.status,
                is_active=model.is_active,
                id_team=model.id_team,
                id_league=model.id_league
            )

        # CASO 2: Si recibimos Team directamente (get_by_id)
        return TeamDTO(
            slug_team=model.slug, # Usamos slug_team
            slug_league="none",
            name=model.name,
            image=model.image or "",
            created_at=model.created_at,
            id_team=model.id_team,
            id_league=id_league
        )
    
    @staticmethod
    def from_dto(dto: TeamDTO) -> Optional[SeasonTeam]:
        return None