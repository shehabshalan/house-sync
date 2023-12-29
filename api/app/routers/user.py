from app.db import get_session
from app.schemas import UserResponse
from app.service import user_service
from fastapi import APIRouter, Depends, Header, status
from sqlmodel import Session

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_user(authorization: str = Header(...), session: Session = Depends(get_session)):
    token = authorization
    return await user_service.get_user(token, session)
