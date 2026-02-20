from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .league_admin import LeagueAdmin
    from .category import Category

class League(Base):
    __tablename__ = "leagues"

    id_league: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    slug: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    country: Mapped[str] = mapped_column(String, nullable=False)
    image: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    id_admin: Mapped[int] = mapped_column(ForeignKey("league_admins.id_admin"), nullable=False)
    id_category: Mapped[int] = mapped_column(ForeignKey("categories.id_category"), nullable=False)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[str] = mapped_column(String, default="active")

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    boxed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    admin: Mapped["LeagueAdmin"] = relationship(lazy="selectin")
    category: Mapped["Category"] = relationship(lazy="selectin")