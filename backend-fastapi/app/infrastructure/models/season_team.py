from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .team import Team
    from .season import Season
    from .league import League
    from .coach import Coach
    from .analyst import Analyst
    from .venue import Venue 

class SeasonTeam(Base):
    __tablename__ = "team_seasons"

    id_team_season: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    id_team: Mapped[int] = mapped_column(ForeignKey("teams.id_team"), nullable=False)
    id_season: Mapped[int] = mapped_column(ForeignKey("seasons.id_season"), nullable=False)
    id_league: Mapped[int] = mapped_column(ForeignKey("leagues.id_league"), nullable=False)
    id_venue: Mapped[Optional[int]] = mapped_column(ForeignKey("venues.id_venue"), nullable=True)
    id_coach: Mapped[Optional[int]] = mapped_column(ForeignKey("coaches.id_coach"), nullable=True)
    id_analyst: Mapped[Optional[int]] = mapped_column(ForeignKey("analysts.id_analyst"), nullable=True)

    status: Mapped[str] = mapped_column(String, default="active")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    team: Mapped["Team"] = relationship(lazy="selectin")
    season: Mapped["Season"] = relationship(lazy="selectin")
    league: Mapped["League"] = relationship(lazy="selectin")
    venue: Mapped[Optional["Venue"]] = relationship(lazy="selectin")
    coach: Mapped[Optional["Coach"]] = relationship(lazy="selectin")
    analyst: Mapped[Optional["Analyst"]] = relationship(lazy="selectin")