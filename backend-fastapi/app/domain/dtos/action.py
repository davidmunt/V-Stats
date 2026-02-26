from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Literal

# Definimos los tipos literales para mayor seguridad en el dominio
ActionType = Literal["SERVE", "RECEPTION", "SET", "ATTACK", "BLOCK", "ERROR"]
ResultType = Literal["SUCCESS", "FAIL", "ACE", "BLOCKED", "ERROR"]

@dataclass
class ActionDTO:
    slug_action: str
    slug_match: str
    slug_set: str
    slug_team: str
    slug_player: str
    action_type: str
    result: str
    player_position: int
    start_x: float
    start_y: float
    end_x: float
    end_y: float
    created_at: datetime
    slug_point_for_team: Optional[str] = None
    status: str = "active"
    is_active: bool = True