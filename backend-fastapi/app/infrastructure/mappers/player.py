from typing import Optional
from app.domain.dtos.player import PlayerDTO
from app.domain.mapper import IModelMapper
from app.infrastructure.models.player import Player

class PlayerModelMapper(IModelMapper[Player, PlayerDTO]):
    @staticmethod
    def to_dto(model: Player) -> Optional[PlayerDTO]:
        if model is None:
            return None
            
        return PlayerDTO(
            id_player=model.id_player,
            slug=model.slug,
            name=model.name,
            avatar=model.avatar,
            status=model.status,
            is_active=model.is_active
        )

    @staticmethod
    def from_dto(dto: PlayerDTO) -> Optional[Player]:
        if dto is None:
            return None
            
        return Player(
            id_player=dto.id_player,
            slug=dto.slug,
            name=dto.name,
            avatar=dto.avatar,
            status=dto.status,
            is_active=dto.is_active
        )