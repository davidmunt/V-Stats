from dataclasses import dataclass
from typing import Optional

@dataclass
class SetDTO:
    slug_set: str
    slug_match: str
    set_number: int
    local_points: int
    visitor_points: int
    finished_at: Optional[str] = None
    status: str = "active"
    is_active: bool = True