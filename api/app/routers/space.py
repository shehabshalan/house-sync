from app.db import get_session
from app.schemas import User
from app.utils.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

router = APIRouter()


@router.get("/spaces", status_code=status.HTTP_200_OK)
async def get_spaces(session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    return {"status": "ok"}
