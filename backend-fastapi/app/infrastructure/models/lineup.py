from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .match import Match
    from .team import Team

class Lineup(Base):
    __tablename__ = "lineups"

    id_lineup: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    
    id_match: Mapped[int] = mapped_column(ForeignKey("matches.id_match"), nullable=False)
    id_team: Mapped[int] = mapped_column(ForeignKey("teams.id_team"), nullable=False)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[str] = mapped_column(String, default="active")

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    boxed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    match: Mapped["Match"] = relationship(lazy="selectin")
    team: Mapped["Team"] = relationship(lazy="selectin")