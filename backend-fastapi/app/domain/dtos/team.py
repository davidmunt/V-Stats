from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class TeamDTO:
    # Obligatorios primero
    slug_team: str  # <--- Asegúrate de que se llame slug_team
    slug_league: str
    name: str
    
    # Opcionales después
    slug_venue: Optional[str] = "none"
    slug_coach: Optional[str] = None
    slug_analyst: Optional[str] = None
    image: Optional[str] = None
    created_at: Optional[datetime] = None
    status: str = "active"
    is_active: bool = True
    id_team: Optional[int] = None
    id_league: Optional[int] = None
    