from contextlib import asynccontextmanager

import uvicorn
from app.config import settings
from app.db import get_session, init_db
from app.models import User
from app.schemas import UserResponse, UserToken
from app.utils.auth import generate_access_token, verify_google_token, verify_token
from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select


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


@app.get("/healthcheck")
async def healthcheck():
    return {"status": "ok"}


@app.post("/auth", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def auth(token: UserToken, session: Session = Depends(get_session)):
    token = token.model_dump()["token"]
    user_info = verify_google_token(token)
    if not user_info:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    user = session.exec(select(User).where(User.email == user_info["email"])).first()
    if not user:
        user = User(
            id=user_info["sub"],
            email=user_info["email"],
            name=user_info["name"],
            picture=user_info["picture"],
        )
        session.add(user)
        session.commit()
        session.refresh(user)
    jwt_payload = user.model_dump()
    token = generate_access_token(jwt_payload)
    return {"token": token, **user.model_dump()}


@app.get("/users/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_user(authorization: str = Header(...), session=Depends(get_session)):
    token = authorization
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    try:
        payload = verify_token(token)
        print("-------------------")
        print(payload)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    user = session.exec(select(User).where(User.email == payload["email"])).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return {"token": token, **user.model_dump()}


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
