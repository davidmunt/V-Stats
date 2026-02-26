from typing import Optional
from app.domain.dtos.action import ActionDTO
from app.domain.mapper import IModelMapper
from app.infrastructure.models.action import Action

class ActionModelMapper(IModelMapper[Action, ActionDTO]):
    @staticmethod
    def to_dto(model: Action) -> Optional[ActionDTO]:
        if model is None:
            return None
        return ActionDTO(
            slug_action=model.slug,
            slug_match=model.match.slug,
            slug_set=model.set.slug,
            slug_team=model.team.slug,
            slug_player=model.player.slug if model.player else "SYSTEM",
            slug_point_for_team=model.point_for_team.slug if model.point_for_team else None,
            player_position=model.player_position,
            action_type=model.action_type,
            result=model.result,
            start_x=model.start_x,
            start_y=model.start_y,
            end_x=model.end_x,
            end_y=model.end_y,
            created_at=model.created_at,
            status=model.status,
            is_active=model.is_active
        )

    @staticmethod
    def from_dto(dto: ActionDTO) -> Optional[Action]:
        # La creación real se hará en el Repositorio/Service usando IDs
        return None