from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .league_admin import LeagueAdmin

class RefreshTokenBlacklist(Base):
    __tablename__ = "refresh_token_blacklist"

    id_blacklist: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    
    id_user: Mapped[int] = mapped_column(ForeignKey("league_admins.id_admin"), nullable=False)
    
    token: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    blacklisted_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    reason: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    user: Mapped["LeagueAdmin"] = relationship(lazy="selectin")