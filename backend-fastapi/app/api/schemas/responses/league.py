from pydantic import BaseModel
from typing import List, Optional

class LeagueResponse(BaseModel):
    slug_league: str
    slug_category: str
    slug_admin: str
    name: str
    country: str
    season: str
    image: str
    is_active: bool
    status: str

    @classmethod
    def from_dto(cls, dto):
        return cls(
            slug_league=dto.slug_league,
            slug_category=dto.slug_category,
            slug_admin=dto.slug_admin,
            name=dto.name,
            country=dto.country,
            season=dto.season,
            image=dto.image,
            is_active=dto.is_active,
            status=dto.status
        )

class LeaguesListResponse(BaseModel):
    leagues: List[LeagueResponse]
