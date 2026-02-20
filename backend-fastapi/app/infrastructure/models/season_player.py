from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Boolean, DateTime, Integer, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .player import Player
    from .season_team import SeasonTeam
    from .season import Season

class SeasonPlayer(Base):
    __tablename__ = "season_players"

    id_season_player: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    id_player: Mapped[int] = mapped_column(ForeignKey("players.id_player"), nullable=False)
    id_season_team: Mapped[int] = mapped_column(ForeignKey("team_seasons.id_team_season"), nullable=False)
    id_season: Mapped[int] = mapped_column(ForeignKey("seasons.id_season"), nullable=False)

    dorsal: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    role: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    status: Mapped[str] = mapped_column(String, default="active")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    boxed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    player: Mapped["Player"] = relationship(lazy="selectin")
    season_team: Mapped["SeasonTeam"] = relationship(lazy="selectin")
    season: Mapped["Season"] = relationship(lazy="selectin")