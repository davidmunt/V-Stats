from dataclasses import dataclass
from typing import Optional

@dataclass
class TeamDTO:
    # Primero los obligatorios (sin valor por defecto)
    id_team: int
    name: str
    slug: str
    
    # Al final los opcionales (con valor por defecto)
    image: Optional[str] = None
    id_league: Optional[int] = None