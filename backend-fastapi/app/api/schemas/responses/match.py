from pydantic import BaseModel
from typing import List, Optional

class MatchResponse(BaseModel):
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
    is_active: bool
    status: str
    id_league: Optional[int]

    @classmethod
    def from_dto(cls, dto):
        if dto is None:
            return None
        return cls(
            slug_match=dto.slug_match,
            slug_league=dto.slug_league,
            slug_team_local=dto.slug_team_local,
            slug_team_visitor=dto.slug_team_visitor,
            slug_venue=dto.slug_venue,
            name=dto.name,
            image=dto.image,
            country=dto.country,
            date=dto.date,
            current_set=dto.current_set,
            is_active=dto.is_active,
            status=dto.status,
            id_league=dto.id_league
        )

class MatchListResponse(BaseModel):
    matches: List[MatchResponse]

class SingleMatchResponse(BaseModel):
    match: MatchResponse
