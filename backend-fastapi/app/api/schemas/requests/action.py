from pydantic import BaseModel, Field
from typing import Optional, Literal

# Definimos los tipos exactos que permite el frontend
ActionType = Literal["SERVE", "RECEPTION", "SET", "ATTACK", "BLOCK", "ERROR"]
ResultType = Literal["++", "+", "-", "--", "SUCCESS", "FAIL", "ACE", "BLOCKED", "ERROR"]

class ActionCreateRequest(BaseModel):
    slug_team: str
    slug_player: str
    action_type: ActionType
    result: ResultType     
    player_position: int = Field(..., ge=1, le=7)
    slug_point_for_team: Optional[str] = None
    start_x: float = 0.0
    start_y: float = 0.0
    end_x: float = 0.0
    end_y: float = 0.0  

class SubstitutionCreateRequest(BaseModel):
    slug_lineup: str
    slug_player_out: str
    slug_player_in: str