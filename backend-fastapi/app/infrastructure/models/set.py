from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Boolean, DateTime, Integer, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

if TYPE_CHECKING:
    from .match import Match

class Set(Base):
    __tablename__ = "sets"

    id_set: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    
    id_match: Mapped[int] = mapped_column(ForeignKey("matches.id_match"), nullable=False)
    
    set_number: Mapped[int] = mapped_column(Integer, nullable=False)
    local_points: Mapped[int] = mapped_column(Integer, default=0)
    visitor_points: Mapped[int] = mapped_column(Integer, default=0)
    
    finished_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[str] = mapped_column(String, default="active")

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    boxed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    match: Mapped["Match"] = relationship(lazy="selectin")