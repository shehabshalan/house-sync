from app.db import get_session
from app.models import User
from app.schemas import UserResponse, UserToken
from app.utils.auth import generate_access_token, verify_google_token
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

router = APIRouter()


@router.post("/auth", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
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
