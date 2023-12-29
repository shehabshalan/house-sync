from app.db import get_session
from app.models import User
from app.utils.auth import get_current_user
from fastapi import Depends, HTTPException, status
from sqlmodel import Session, select


async def get_user(token: str, session: Session = Depends(get_session)):
    decoded_user = get_current_user(token)
    user = session.exec(select(User).where(User.email == decoded_user["email"])).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid credentials")

    return {"token": token, **user.model_dump()}
