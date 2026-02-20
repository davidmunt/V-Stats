from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import String, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .league_admin import LeagueAdmin

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id_refresh_token: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    
    id_user: Mapped[int] = mapped_column(ForeignKey("league_admins.id_admin"), nullable=False)
    
    token: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped["LeagueAdmin"] = relationship(lazy="selectin")