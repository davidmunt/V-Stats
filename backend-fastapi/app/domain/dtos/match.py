from dataclasses import dataclass
from typing import Optional

@dataclass
class MatchDTO:
    id_match: int
    id_match: int
    id_local_team: int
    id_visitor_team: int
    slug_match: str
    slug_league: str
    slug_team_local: str
    slug_team_visitor: str
    slug_venue: str
    name: str
    image: str
    country: str
    date: str
    current_set: int
    sets: list = None
    is_active: bool = True
    status: str = "active"
    id_league: Optional[int] = None
