from app.db import get_session
from app.models import User
from app.schemas import UserResponse
from app.utils.auth import get_current_user
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlmodel import Session, select

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_user(authorization: str = Header(...), session: Session = Depends(get_session)):
    token = authorization
    decoded_user = get_current_user(token)
    user = session.exec(select(User).where(User.email == decoded_user["email"])).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid credentials")

    return {"token": token, **user.model_dump()}
