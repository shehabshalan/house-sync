from app.models import User
from app.schemas import UserToken
from app.utils.auth import generate_access_token, verify_google_token
from fastapi import HTTPException, status
from sqlmodel import Session, select


async def auth_user(token: UserToken, session: Session):
    token = token.model_dump()["token"]
    user_info = verify_google_token(token)
    if not user_info:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    user = session.exec(select(User).where(User.email == user_info["email"])).first()

    if not user:
        user = User(
            email=user_info["email"],
            name=user_info["name"],
            picture=user_info["picture"],
            is_active=True,
        )
        session.add(user)
        session.commit()
        session.refresh(user)

    if user.is_active is False:
        user.is_active = True
        user.name = user_info["name"]
        user.picture = user_info["picture"]
        session.add(user)
        session.commit()
        session.refresh(user)

    jwt_payload = user.model_dump()
    token = generate_access_token(jwt_payload)
    return {"token": token, **user.model_dump()}
