from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Boolean, DateTime, Integer, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .league import League
    from .team import Team
    from .venue import Venue
    from .league_admin import LeagueAdmin

class Match(Base):
    __tablename__ = "matches"

    id_match: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    
    id_league: Mapped[int] = mapped_column(ForeignKey("leagues.id_league"), nullable=False)
    id_local_team: Mapped[int] = mapped_column(ForeignKey("teams.id_team"), nullable=False)
    id_visitor_team: Mapped[int] = mapped_column(ForeignKey("teams.id_team"), nullable=False)
    id_venue: Mapped[int] = mapped_column(ForeignKey("venues.id_venue"), nullable=False)
    id_admin_creator: Mapped[int] = mapped_column(ForeignKey("league_admins.id_admin"), nullable=False)

    date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    current_set: Mapped[int] = mapped_column(Integer, default=1)
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[str] = mapped_column(String, default="scheduled")

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    boxed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    league: Mapped["League"] = relationship(lazy="selectin")
    local_team: Mapped["Team"] = relationship(lazy="selectin", foreign_keys=[id_local_team])
    visitor_team: Mapped["Team"] = relationship(lazy="selectin", foreign_keys=[id_visitor_team])
    venue: Mapped["Venue"] = relationship(lazy="selectin")
    admin_creator: Mapped["LeagueAdmin"] = relationship(lazy="selectin")