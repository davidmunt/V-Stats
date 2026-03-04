from pydantic import BaseModel
from typing import List, Optional

class LeagueTableResponse(BaseModel):
    slug_team: str 
    name: str
    image: Optional[str]
    played: int
    won: int
    lost: int
    points: int
    sets_won: int
    sets_lost: int
    points_favor: int
    points_against: int
    points_diff: int

    @classmethod
    def from_dto(cls, dto):
        return cls(
            slug_team=dto.slug_team,
            name=dto.name,
            image=dto.image,
            played=dto.played,
            won=dto.won,
            lost=dto.lost,
            points=dto.points,
            sets_won=dto.sets_won,
            sets_lost=dto.sets_lost,
            points_favor=dto.points_favor,
            points_against=dto.points_against,
            points_diff=dto.points_diff
        )

class LeagueTableListResponse(BaseModel):
    List[LeagueTableResponse]
