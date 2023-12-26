from app.db import get_session
from app.models import User
from app.schemas import UserResponse
from app.utils.auth import verify_token
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlmodel import Session, select

router = APIRouter()


@router.get("/users/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_user(authorization: str = Header(...), session: Session = Depends(get_session)):
    token = authorization
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    user = session.exec(select(User).where(User.email == payload["email"])).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return {"token": token, **user.model_dump()}
