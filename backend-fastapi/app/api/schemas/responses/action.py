from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.api.schemas.responses.set import SetResponse

class ActionResponse(BaseModel):
    slug_action: str
    slug_match: str
    slug_set: str
    slug_team: str
    slug_player: str
    slug_point_for_team: Optional[str]
    action_type: str
    result: str
    player_position: int
    start_x: float
    start_y: float
    end_x: float
    end_y: float

    @classmethod
    def from_dto(cls, dto):
        return cls(**dto.__dict__)

class SingleActionResponse(BaseModel):
    action: ActionResponse
    new_set: Optional[SetResponse] = None
    match_finished: bool = False