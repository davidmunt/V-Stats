from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Boolean, DateTime, Integer, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .match import Match
    from .set import Set
    from .team import Team
    from .player import Player

class Substitution(Base):
    __tablename__ = "substitutions"

    id_substitution: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    
    id_match: Mapped[int] = mapped_column(ForeignKey("matches.id_match"), nullable=False)
    id_set: Mapped[int] = mapped_column(ForeignKey("sets.id_set"), nullable=False)
    id_team: Mapped[int] = mapped_column(ForeignKey("teams.id_team"), nullable=False)
    id_other_player: Mapped[int] = mapped_column(ForeignKey("players.id_player"), nullable=False)
    id_libero_player: Mapped[Optional[int]] = mapped_column(ForeignKey("players.id_player"), nullable=True)

    libero_is_replacing: Mapped[Optional[bool]] = mapped_column(Boolean)
    position: Mapped[int] = mapped_column(Integer, nullable=False) # 1 a 6

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[str] = mapped_column(String, default="active")

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    boxed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    match: Mapped["Match"] = relationship(lazy="selectin")
    set: Mapped["Set"] = relationship(lazy="selectin")
    team: Mapped["Team"] = relationship(lazy="selectin")
    other_player: Mapped["Player"] = relationship(lazy="selectin", foreign_keys=[id_other_player])
    libero_player: Mapped[Optional["Player"]] = relationship(lazy="selectin", foreign_keys=[id_libero_player])