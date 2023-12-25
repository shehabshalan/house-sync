from pydantic_settings import BaseSettings


class CommonSettings(BaseSettings):
    APP_NAME: str = "HouseSync"
    DEBUG_MODE: bool = True
    LOGGING_CONFIG: str = "./log_config.yaml"


class ServerSettings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8000


# class DatabaseSettings(BaseSettings):
#     DB_URL: str
#     DB_NAME: str


class Settings(CommonSettings, ServerSettings):
    pass


settings = Settings()
