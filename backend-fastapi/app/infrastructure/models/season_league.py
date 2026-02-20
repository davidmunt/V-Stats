from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import String, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .league import League
    from .season import Season
    from .category import Category

class SeasonLeague(Base):
    __tablename__ = "season_leagues"

    id_season_league: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    id_league: Mapped[int] = mapped_column(ForeignKey("leagues.id_league"), nullable=False)
    id_season: Mapped[int] = mapped_column(ForeignKey("seasons.id_season"), nullable=False)
    id_category: Mapped[int] = mapped_column(ForeignKey("categories.id_category"), nullable=False)

    status: Mapped[str] = mapped_column(String, default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    league: Mapped["League"] = relationship(lazy="selectin")
    season: Mapped["Season"] = relationship(lazy="selectin")
    category: Mapped["Category"] = relationship(lazy="selectin")