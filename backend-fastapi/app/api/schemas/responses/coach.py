from pydantic import BaseModel

from app.domain.dtos.coach import CoachDTO


class CoachResponse(BaseModel):
    slug_coach: str
    slug_team: str
    name: str
    email: str
    user_type: str
    avatar: str

    @classmethod
    def from_dto(cls, dto: CoachDTO) -> "CoachResponse":
        return cls(
            slug_coach=dto.slug_coach,
            slug_team=dto.slug_team,
            name=dto.name,
            email=dto.email,
            user_type=dto.user_type,
            avatar=dto.avatar,
        )
