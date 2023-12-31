from contextlib import asynccontextmanager

import uvicorn
from app.config import settings
from app.db import init_db
from app.routers import auth, shopping, space, task, user
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthcheck", tags=["Healthcheck"])
async def healthcheck():
    return {"status": "ok"}


app.include_router(router=user.router)
app.include_router(router=auth.router)
app.include_router(router=space.router)
app.include_router(router=task.router)
app.include_router(router=shopping.router)


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
