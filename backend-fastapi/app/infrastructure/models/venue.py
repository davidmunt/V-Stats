from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Boolean, DateTime, Integer, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .league_admin import LeagueAdmin

class Venue(Base):
    __tablename__ = "venues"

    id_venue: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    
    id_admin: Mapped[int] = mapped_column(ForeignKey("league_admins.id_admin"), nullable=False)
    
    name: Mapped[str] = mapped_column(String, nullable=False)
    address: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    capacity: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    indoor: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[str] = mapped_column(String, default="active")

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    boxed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    admin: Mapped["LeagueAdmin"] = relationship(lazy="selectin")