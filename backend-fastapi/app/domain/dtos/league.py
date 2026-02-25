from dataclasses import dataclass
from typing import Optional

@dataclass
class LeagueDTO:
    slug_league: str
    slug_category: str
    slug_admin: str
    name: str
    country: str
    season: str
    image: Optional[str] = None
    is_active: bool = True
    status: str = "active"
    id_league: Optional[int] = None