from pydantic import BaseModel, Field
from typing import Optional, Literal

# Definimos los tipos exactos que permite el frontend
ActionType = Literal["SERVE", "RECEPTION", "SET", "ATTACK", "BLOCK", "ERROR"]
ResultType = Literal["++", "+", "-", "--", "SUCCESS", "FAIL", "ACE", "BLOCKED", "ERROR"]

class ActionCreateRequest(BaseModel):
    slug_team: str
    slug_player: str
    action_type: ActionType # Cambiado de str a ActionType
    result: ResultType      # Cambiado de str a ResultType
    player_position: int = Field(..., ge=1, le=7)
    slug_point_for_team: Optional[str] = None
    start_x: float = 0.0
    start_y: float = 0.0
    end_x: float = 0.0
    end_y: float = 0.0