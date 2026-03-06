from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .season_player import SeasonPlayer

class Player(Base):
    __tablename__ = "players"

    id_player: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    avatar: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[str] = mapped_column(String, default="active")
    seasons: Mapped[List["SeasonPlayer"]] = relationship(back_populates="player")

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())