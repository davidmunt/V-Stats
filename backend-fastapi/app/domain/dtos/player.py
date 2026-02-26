from dataclasses import dataclass
from typing import Optional

@dataclass
class PlayerDTO:
    slug: str
    name: str
    id_player: Optional[int] = None
    avatar: Optional[str] = None
    status: str = "active"
    is_active: bool = True