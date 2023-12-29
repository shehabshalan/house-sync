from typing import List

from app import schemas
from app.db import get_session
from app.service import space_service
from app.utils.auth import get_current_user
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

router = APIRouter(
    prefix="/spaces",
    tags=["Spaces"],
)


@router.get("/", status_code=status.HTTP_200_OK, response_model=List[schemas.GetSpace])
async def get_user_spaces(
    session: Session = Depends(get_session), user: schemas.User = Depends(get_current_user)
) -> List[schemas.GetSpace]:
    return await space_service.get_user_spaces(session, user)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_space(
    space: schemas.CreateSpace, session: Session = Depends(get_session), user: schemas.User = Depends(get_current_user)
):
    return await space_service.create_space(space, session, user)


@router.post("/invite", status_code=status.HTTP_201_CREATED)
async def create_user_invites(
    invite_users: schemas.InviteUser,
    session: Session = Depends(get_session),
    user: schemas.User = Depends(get_current_user),
):
    return await space_service.create_user_invites(invite_users, session, user)


@router.get("/{space_id}", status_code=status.HTTP_200_OK)
async def get_space(
    space_id: int, session: Session = Depends(get_session), user: schemas.User = Depends(get_current_user)
):
    return await space_service.get_space(space_id, session, user)
