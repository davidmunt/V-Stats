from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.api.router import router as api_router
from app.core.config import get_app_settings
from app.core.exceptions import add_exception_handlers
from app.core.logging import configure_logger
from app.core.container import container_instance


def create_app() -> FastAPI:
    settings = get_app_settings()

    app = FastAPI(**settings.fastapi_kwargs)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_hosts,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix=settings.api_prefix)

    add_exception_handlers(app=app)
    configure_logger()

    return app

app = create_app()
