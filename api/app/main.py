import uvicorn
from app.config import settings
from fastapi import FastAPI

app = FastAPI()


@app.get("/healthcheck")
async def healthcheck():
    return {"status": "ok"}


def main():
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        reload=settings.DEBUG_MODE,
        port=settings.PORT,
        log_config=settings.LOGGING_CONFIG,
    )


if __name__ == "__main__":
    main()
