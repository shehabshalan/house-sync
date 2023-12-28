from typing import List

from app import schemas
from app.db import get_session
from app.models import Space, SpaceUser, Task, TaskUser, User
from app.utils.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

router = APIRouter()


@router.get("/spaces", status_code=status.HTTP_200_OK, response_model=List[schemas.GetSpace])
async def get_user_spaces(
    session: Session = Depends(get_session), user: schemas.User = Depends(get_current_user)
) -> List[schemas.GetSpace]:
    try:
        user_spaces_ids = session.exec(select(SpaceUser).where(SpaceUser.user_email == user["email"])).all()
        user_spaces = []
        for space_id in user_spaces_ids:
            space = session.exec(select(Space).where(Space.id == space_id.space_id)).first()
            space_data = space.model_dump()
            space_data["users"] = []
            space_members = session.exec(select(User).join(SpaceUser).where(SpaceUser.space_id == space.id)).all()
            for member in space_members:
                space_data["users"].append(member.model_dump())
            user_spaces.append(space_data)
        return user_spaces
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/spaces", status_code=status.HTTP_201_CREATED)
async def create_space(
    space: schemas.CreateSpace, session: Session = Depends(get_session), user: schemas.User = Depends(get_current_user)
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
    invite_users: schemas.InviteUser,
    session: Session = Depends(get_session),
    user: schemas.User = Depends(get_current_user),
):
    existing_users = session.exec(select(User).where(User.email.in_(invite_users.emails))).all()
    existing_emails = {user.email for user in existing_users}

    new_users = [User(email=email) for email in invite_users.emails if email not in existing_emails]
    try:
        for user in new_users:
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
    space_id: int, session: Session = Depends(get_session), user: schemas.User = Depends(get_current_user)
):
    user_in_space = session.exec(
        select(User).join(SpaceUser).where(SpaceUser.space_id == space_id, User.email == user["email"])
    ).first()
    if not user_in_space:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is not a member of the space")
    space = session.exec(select(Space).where(Space.id == space_id)).first()
    if not space:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Space not found")
    users_in_space = session.exec(select(User).join(SpaceUser).where(SpaceUser.space_id == space_id)).all()
    tasks_in_space = session.exec(select(Task).where(Task.space_id == space_id)).all()
    space_details = {
        "name": space.name,
        "description": space.description,
        "owner_email": space.owner_email,
        "users": [
            {
                "email": user.email,
                "name": user.name,
                "picture": user.picture,
                "is_active": user.is_active,
            }
            for user in users_in_space
        ],
        "tasks": [
            {
                "id": task.id,
                "name": task.name,
                "description": task.description,
                "frequency": task.frequency,
                "space_id": task.space_id,
                "users": [
                    {
                        "id": task_user.id,
                        "task_id": task_user.task_id,
                        "user_email": task_user.user_email,
                        "is_completed": task_user.is_completed,
                        "due_date": task_user.due_date,
                    }
                    for task_user in session.exec(select(TaskUser).where(TaskUser.task_id == task.id)).all()
                ],
            }
            for task in tasks_in_space
        ],
    }

    return space_details


@router.delete("/spaces/{space_id}", status_code=status.HTTP_200_OK)
async def delete_space(
    space_id: int, session: Session = Depends(get_session), user: schemas.User = Depends(get_current_user)
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
    space: schemas.CreateSpace,
    session: Session = Depends(get_session),
    user: schemas.User = Depends(get_current_user),
):
    space = session.exec(select(Space).where(Space.id == space_id)).first()
    if not space:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Space not found")
    space.name = space.name
    space.description = space.description
    session.commit()
    session.refresh(space)
    return space.model_dump()
