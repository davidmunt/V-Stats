from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Literal

ActionType = Literal["SERVE", "RECEPTION", "SET", "ATTACK", "BLOCK", "DIG", "ERROR", "POINT_ADJUSTMENT"]
ResultType = Literal["SUCCESS", "FAIL", "ACE", "BLOCKED", "ERROR"]

@dataclass
class ActionDTO:
    slug_action: str
    slug_match: str
    slug_set: str
    slug_team: str
    slug_analyst: str
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
    slug_analyst: str
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


@dataclass
class ActionResultBreakdownStatsDTO:
    slug_team: Optional[str] = None
    slug_player: Optional[str] = None
    slug_match: Optional[str] = None
    percentage_serve_double_plus: float = 0.0
    percentage_serve_plus: float = 0.0
    percentage_serve_minus: float = 0.0
    percentage_serve_double_minus: float = 0.0
    percentage_attack_double_plus: float = 0.0
    percentage_attack_plus: float = 0.0
    percentage_attack_minus: float = 0.0
    percentage_attack_double_minus: float = 0.0
    percentage_block_double_plus: float = 0.0
    percentage_block_plus: float = 0.0
    percentage_block_minus: float = 0.0
    percentage_block_double_minus: float = 0.0
    percentage_reception_double_plus: float = 0.0
    percentage_reception_plus: float = 0.0
    percentage_reception_minus: float = 0.0
    percentage_reception_double_minus: float = 0.0
    percentage_colocacion_double_plus: float = 0.0
    percentage_colocacion_plus: float = 0.0
    percentage_colocacion_minus: float = 0.0
    percentage_colocacion_double_minus: float = 0.0
    percentage_defensa_double_plus: float = 0.0
    percentage_defensa_plus: float = 0.0
    percentage_defensa_minus: float = 0.0
    percentage_defensa_double_minus: float = 0.0


@dataclass
class TeamActionResultBreakdownDTO:
    slug_team: str
    stats: ActionResultBreakdownStatsDTO


@dataclass
class PlayerActionResultBreakdownDTO:
    slug_player: str
    stats: ActionResultBreakdownStatsDTO


@dataclass
class TeamActionResultBreakdownByMatchDTO:
    slug_team: str
    slug_match: str
    stats: ActionResultBreakdownStatsDTO


@dataclass
class PlayerActionResultBreakdownByMatchDTO:
    slug_player: str
    slug_match: str
    stats: ActionResultBreakdownStatsDTO
