from typing import List, Optional
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.models.lineup import Lineup
from app.infrastructure.models.lineup_position import LineupPosition

class LineupRepository:
    """
    Repositorio para gestionar las alineaciones y posiciones en pista.
    No usamos DTOs aquí porque el Service necesita los modelos para rotarlos.
    """

    async def get_active_lineup_by_team_and_match(
        self, session: AsyncSession, id_match: int, id_team: int
    ) -> Optional[Lineup]:
        """Busca la alineación activa para un equipo en un partido."""
        query = select(Lineup).where(
            and_(
                Lineup.id_match == id_match,
                Lineup.id_team == id_team,
                Lineup.is_active == True
            )
        )
        result = await session.execute(query)
        return result.scalar_one_or_none()

    async def get_court_positions(
        self, session: AsyncSession, id_lineup: int
    ) -> List[LineupPosition]:
        """
        Obtiene los jugadores que están en pista (posiciones 1 a 6).
        Ignoramos la posición 7 (líberos/reservas).
        """
        query = select(LineupPosition).where(
            and_(
                LineupPosition.id_lineup == id_lineup,
                LineupPosition.current_position >= 1,
                LineupPosition.current_position <= 6,
                LineupPosition.is_active == True
            )
        )
        result = await session.execute(query)
        return result.scalars().all()

    async def update_position(self, session: AsyncSession, position_model: LineupPosition, new_pos: int):
        """Actualiza la posición de un jugador."""
        position_model.current_position = new_pos
        # Usamos flush para sincronizar con la DB sin cerrar la transacción
        await session.flush()