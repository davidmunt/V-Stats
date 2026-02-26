from fastapi import APIRouter

from app.api.routes import coach, analyst, league, match, set, team

router = APIRouter()

router.include_router(router=coach.router, tags=["Coaches"], prefix="/coaches")
router.include_router(router=analyst.router, tags=["Analysts"], prefix="/analysts")
router.include_router(router=league.router, tags=["Leagues"], prefix="/leagues")
router.include_router(router=match.router, tags=["Matches"], prefix="/matches")
router.include_router(router=set.router, tags=["Sets"], prefix="/sets")
router.include_router(router=team.router, tags=["Teams"], prefix="/teams")
