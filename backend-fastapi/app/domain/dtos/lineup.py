from dataclasses import dataclass
from typing import List, Optional

@dataclass
class LineupPositionDTO:
    slug_position: str
    slug_player: str
    player_name: str
    current_position: int 
    is_on_court: bool

@dataclass
class LineupDTO:
    slug_lineup: str
    slug_match: str
    slug_team: str
    positions: List[LineupPositionDTO]