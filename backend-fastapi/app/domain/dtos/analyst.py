from dataclasses import dataclass
from typing import Optional

@dataclass
class AnalystDTO:
    slug_analyst: str
    name: str
    email: str
    user_type: str
    slug_team: str
    avatar: Optional[str] = None
    id_analyst: Optional[int] = None 
    id_team: Optional[int] = None  
    is_active: bool = True
    status: str = "active"