from datetime import datetime, date
from sqlalchemy import String, Boolean, DateTime, Date, func
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class Season(Base):
    __tablename__ = "seasons"

    id_season: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    
    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    
    start_date: Mapped[date] = mapped_column(Date, nullable=True)
    end_date: Mapped[date] = mapped_column(Date, nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())