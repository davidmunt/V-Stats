from fastapi import APIRouter

from app.api.routes import coach

router = APIRouter()

router.include_router(router=coach.router, tags=["Coaches"], prefix="/coaches")
