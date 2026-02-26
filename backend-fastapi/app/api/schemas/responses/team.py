from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TeamResponse(BaseModel):
    slug_team: str
    slug_venue: str
    slug_coach: Optional[str]
    slug_analyst: Optional[str]
    slug_league: str
    name: str
    image: str
    created_at: datetime
    status: str
    is_active: bool

    @classmethod
    def from_dto(cls, dto):
        return cls(
            slug_team=dto.slug_team,
            slug_venue=dto.slug_venue,
            slug_coach=dto.slug_coach,
            slug_analyst=dto.slug_analyst,
            slug_league=dto.slug_league,
            name=dto.name,
            image=dto.image,
            created_at=dto.created_at,
            status=dto.status,
            is_active=dto.is_active
        )

class TeamsResponse(BaseModel):
    teams: List[TeamResponse]