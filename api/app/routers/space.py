from typing import List

from app.db import get_session
from app.models import Space, SpaceUser, User
from app.schemas import CreateSpace, GetSpace, InviteUser
from app.schemas import User as UserSchema
from app.utils.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

router = APIRouter()


@router.get("/spaces", status_code=status.HTTP_200_OK, response_model=List[GetSpace])
async def get_user_spaces(
    session: Session = Depends(get_session), user: UserSchema = Depends(get_current_user)
) -> List[GetSpace]:
    try:
        user_spaces = session.exec(select(Space).where(Space.owner_email == user["email"])).all()
        space_users = []
        for space_user in user_spaces:
            users = session.exec(select(SpaceUser).where(SpaceUser.space_id == space_user.id)).all()
            space_users.append({**space_user.model_dump(), "users": users})
        for space_user in space_users:
            space_user["users"] = session.exec(
                select(User).join(SpaceUser).where(SpaceUser.space_id == space_user["id"])
            ).all()
        return space_users
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/spaces", status_code=status.HTTP_201_CREATED)
async def create_space(
    space: CreateSpace, session: Session = Depends(get_session), user: UserSchema = Depends(get_current_user)
):
    space = Space(**space.model_dump(), owner_email=user["email"])

    try:
        session.add(space)
        session.commit()
        session.refresh(space)
        space_user = SpaceUser(space_id=space.id, user_email=user["email"])
        session.add(space_user)
        session.commit()
        session.refresh(space_user)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    return space.model_dump()


@router.post("/spaces/invite", status_code=status.HTTP_201_CREATED)
async def create_user_invites(
    invite_users: InviteUser, session: Session = Depends(get_session), user: UserSchema = Depends(get_current_user)
):
    users = [User(email=email) for email in invite_users.emails]
    try:
        for user in users:
            session.add(user)
            session.commit()
            session.refresh(user)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    invites = [SpaceUser(space_id=invite_users.space_id, user_email=email) for email in invite_users.emails]
    try:
        for invite in invites:
            session.add(invite)
            session.commit()
            session.refresh(invite)

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return {"message": "Invites sent successfully"}


@router.get("/spaces/{space_id}", status_code=status.HTTP_200_OK)
async def get_space(
    space_id: int, session: Session = Depends(get_session), user: UserSchema = Depends(get_current_user)
):
    space = session.exec(select(Space).where(Space.id == space_id)).first()
    if not space:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Space not found")
    return space.model_dump()


@router.delete("/spaces/{space_id}", status_code=status.HTTP_200_OK)
async def delete_space(
    space_id: int, session: Session = Depends(get_session), user: UserSchema = Depends(get_current_user)
):
    space = session.exec(select(Space).where(Space.id == space_id)).first()
    if not space:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Space not found")
    session.delete(space)
    session.commit()
    return {"message": "Space deleted successfully"}


@router.put("/spaces/{space_id}", status_code=status.HTTP_200_OK)
async def update_space(
    space_id: int,
    space: CreateSpace,
    session: Session = Depends(get_session),
    user: UserSchema = Depends(get_current_user),
):
    space = session.exec(select(Space).where(Space.id == space_id)).first()
    if not space:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Space not found")
    space.name = space.name
    space.description = space.description
    session.commit()
    session.refresh(space)
    return space.model_dump()
