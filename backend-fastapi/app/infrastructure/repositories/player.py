from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.repositories.player import IPlayerRepository
from app.domain.dtos.player import PlayerDTO
from app.infrastructure.models.player import Player
from app.domain.mapper import IModelMapper

class PlayerRepository(IPlayerRepository):
    def __init__(self, player_mapper: IModelMapper):
        self.mapper = player_mapper

    async def get_by_slug(self, session: AsyncSession, slug: str) -> Optional[PlayerDTO]:
        """
        Busca un jugador por su slug y devuelve su DTO.
        """
        query = select(Player).where(Player.slug == slug)
        result = await session.execute(query)
        player_model = result.scalar_one_or_none()
        
        return self.mapper.to_dto(player_model)

    async def get_by_id(self, session: AsyncSession, id_player: int) -> Optional[PlayerDTO]:
        """
        Busca un jugador por su ID primario.
        """
        query = select(Player).where(Player.id_player == id_player)
        result = await session.execute(query)
        player_model = result.scalar_one_or_none()
        
        return self.mapper.to_dto(player_model)