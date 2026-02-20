from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Boolean, DateTime, Integer, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .lineup import Lineup
    from .player import Player

class LineupPosition(Base):
    __tablename__ = "lineup_positions"

    id_lineup_position: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    
    id_lineup: Mapped[int] = mapped_column(ForeignKey("lineups.id_lineup"), nullable=False)
    id_player: Mapped[int] = mapped_column(ForeignKey("players.id_player"), nullable=False)

    is_on_court: Mapped[Optional[bool]] = mapped_column(Boolean)
    initial_position: Mapped[Optional[int]] = mapped_column(Integer) # 1 a 6
    current_position: Mapped[Optional[int]] = mapped_column(Integer)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[str] = mapped_column(String, default="active")

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    boxed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    lineup: Mapped["Lineup"] = relationship(lazy="selectin")
    player: Mapped["Player"] = relationship(lazy="selectin")