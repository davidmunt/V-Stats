from dataclasses import dataclass

@dataclass(frozen=True)
class CoachDTO:
    slug_coach: str
    slug_team: str
    name: str
    email: str
    user_type: str
    avatar: str
