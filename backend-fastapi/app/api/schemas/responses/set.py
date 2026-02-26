from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SetResponse(BaseModel):
    slug_set: str
    slug_match: str
    set_number: int
    local_points: int
    visitor_points: int
    finished_at: Optional[str]
    status: str
    is_active: bool

    @classmethod
    def from_dto(cls, dto):
        if dto is None:
            return None
        return cls(
            slug_set=dto.slug_set,
            slug_match=dto.slug_match,
            set_number=dto.set_number,
            local_points=dto.local_points,
            visitor_points=dto.visitor_points,
            finished_at=dto.finished_at,
            status=dto.status,
            is_active=dto.is_active
        )

# Este envuelve al objeto para cumplir con SingleSetResponse del front
class SingleSetResponse(BaseModel):
    set: SetResponse