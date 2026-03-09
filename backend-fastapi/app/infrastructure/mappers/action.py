from typing import Optional

from datetime import datetime
from app.domain.dtos.action import ActionDTO, ActionStatDTO, ActionGeneralStatsDTO
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
        return None
    
    @staticmethod
    def to_general_stats_dto(model: Action) -> ActionGeneralStatsDTO:
        if model is None:
            return None
        
        return ActionGeneralStatsDTO(
            slug_team=model.team.slug if model.team else "none",
            percentage_success=0.0,
            percentage_error=0.0,
            percentage_serve_success=0.0,
            percentage_serve_error=0.0,
            percentage_reception_success=0.0,
            percentage_reception_error=0.0,
            percentage_block_success=0.0,
            percentage_block_error=0.0,
            percentage_attack_success=0.0,
            percentage_attack_error=0.0
        )
    
    @staticmethod
    def to_stat_dto(model: Action) -> ActionStatDTO:
        if model is None:
            return None
        
        dorsal = 0
        if model.player and hasattr(model.player, 'seasons'):
            season_record = next(
                (s for s in model.player.seasons if s.season_team.id_team == model.id_team), 
                None
            )
            
            if not season_record and model.player.seasons:
                season_record = model.player.seasons[0] 
                
            if season_record:
                dorsal = season_record.dorsal

        return ActionStatDTO(
            slug_match=model.set.match.slug if model.set and model.set.match else "none",
            slug_set=model.set.slug if model.set else "none",
            set_number=model.set.set_number if model.set else 0,
            slug_team=model.team.slug if model.team else "none",
            slug_player=model.player.slug if model.player else "none",
            player_name=model.player.name if model.player else "Unknown",
            player_dorsal=dorsal,
            player_position=getattr(model.player, 'id_position', 0),
            action_type=model.action_type,
            result=model.result,
            slug_point_for_team=model.point_for_team.slug if model.point_for_team else None,
            start_x=model.start_x,
            start_y=model.start_y,
            end_x=model.end_x,
            end_y=model.end_y,
            timestamp=model.created_at if model.created_at else datetime.now(),
        )