from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class StatResponse(BaseModel):
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
    slug_point_for_team: str
    start_x: float
    start_y: float
    end_x: float
    end_y: float
    timestamp: datetime


    @classmethod
    def from_dto(cls, dto):
        return cls(
            slug_match=dto.slug_match,
            slug_set=dto.slug_set,
            set_number=dto.set_number,
            slug_team=dto.slug_team,
            slug_player=dto.slug_player,
            player_name=dto.player_name,
            player_dorsal=dto.player_dorsal,
            player_position=dto.player_position,
            action_type=dto.action_type,
            result=dto.result,
            slug_point_for_team=dto.slug_point_for_team,
            start_x=dto.start_x,
            start_y=dto.start_y,
            end_x=dto.end_x,
            end_y=dto.end_y,
            timestamp=dto.timestamp
        )

class StatsResponse(BaseModel):
    stats: List[StatResponse]
