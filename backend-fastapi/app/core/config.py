from functools import lru_cache

from conduit.core.settings.app import AppSettings
from conduit.core.settings.base import AppEnvTypes, BaseAppSettings
from conduit.core.settings.development import DevAppSettings
from conduit.core.settings.production import ProdAppSettings
from conduit.core.settings.test import TestAppSettings

# Este archivo define la configuración de la aplicación según el entorno (desarrollo, pruebas o producción)
# y provee la función get_app_settings() para obtener los settings actuales de manera cacheada.

AppEnvType = DevAppSettings | TestAppSettings | ProdAppSettings

environments: dict[str, type[AppEnvType]] = {  # type: ignore
    AppEnvTypes.development: DevAppSettings,
    AppEnvTypes.testing: TestAppSettings,
    AppEnvTypes.production: ProdAppSettings,
}


@lru_cache
def get_app_settings() -> AppSettings:
    """
    Return application config.
    """
    app_env = BaseAppSettings().app_env
    config = environments[app_env]
    return config()  # type: ignore
