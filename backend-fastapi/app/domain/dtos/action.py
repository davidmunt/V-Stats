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

@dataclass
class ActionStatDTO:
    slug_match: str
    slug_set: str
    set_number: int
    slug_team: str
    slug_player: str
    player_name: str
    player_dorsal: int
    player_position: int
    action_type: str
    result: str
    slug_point_for_team: Optional[str]
    start_x: float
    start_y: float
    end_x: float
    end_y: float
    timestamp: datetime

@dataclass
class ActionGeneralStatsDTO:
    slug_team: str
    percentage_success: float
    percentage_error: float
    percentage_serve_success: float
    percentage_serve_error: float
    percentage_reception_success: float
    percentage_reception_error: float
    percentage_block_success: float
    percentage_block_error: float
    percentage_attack_success: float
    percentage_attack_error: float