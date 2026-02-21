from pydantic import BaseModel
from typing import List, Optional

class AnalystResponse(BaseModel):
    slug_analyst: str
    name: str
    email: str
    avatar: Optional[str]
    slug_team: str
    user_type: str
    is_active: bool
    status: str

    @classmethod
    def from_dto(cls, dto):
        return cls(
            slug_analyst=dto.slug_analyst,
            name=dto.name,
            email=dto.email,
            avatar=dto.avatar,
            slug_team=dto.slug_team,
            user_type=dto.user_type,
            is_active=dto.is_active,
            status=dto.status
        )

class AnalystsListResponse(BaseModel):
    analysts: List[AnalystResponse]