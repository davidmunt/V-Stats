from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.core.container import container_instance

from app.api.router import router as api_router
from app.core.config import get_app_settings
from app.core.exceptions import add_exception_handlers
from app.core.logging import configure_logger
from app.core.container import Container, container_instance


def create_app() -> FastAPI:
    """
    Application factory.

    Se encarga de:
    - Crear la app FastAPI
    - Cargar configuración
    - Registrar middlewares básicos
    - Registrar routers
    - Registrar manejadores de excepciones
    - Configurar logging
    """

    container_instance.coach_service()
    container_instance.analyst_service()
    settings = get_app_settings()

    app = FastAPI(**settings.fastapi_kwargs)

    # CORS (útil incluso en desarrollo)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_hosts,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routers
    app.include_router(api_router, prefix="/api")

    # Exception handlers
    add_exception_handlers(app=app)

    # Logging
    configure_logger()

    return app

app = create_app()
