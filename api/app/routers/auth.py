from app.db import get_session
from app.schemas import UserResponse, UserToken
from app.service import auth_service
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

router = APIRouter(
    tags=["Authentication"],
)


@router.post("/auth", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def auth(token: UserToken, session: Session = Depends(get_session)):
    return await auth_service.auth_user(token, session)
