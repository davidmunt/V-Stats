from fastapi import APIRouter

from app.api.routes import pruebas

router = APIRouter()

router.include_router(router=pruebas.router, tags=["Pruebas"], prefix="/pruebas")
