from typing import List

from app import schemas
from app.db import get_session
from app.service import shopping_service
from app.utils.auth import get_current_user
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

router = APIRouter(
    prefix="/shopping",
    tags=["Shopping"],
)


@router.get("/{space_id}", status_code=status.HTTP_200_OK)
async def get_shopping_list(
    space_id: int, session: Session = Depends(get_session), user: schemas.User = Depends(get_current_user)
):
    return await shopping_service.get_shopping_list(space_id, session, user)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_shopping_item(
    item: schemas.CreateItem,
    session: Session = Depends(get_session),
    user: schemas.User = Depends(get_current_user),
):
    return await shopping_service.create_shopping_item(item, session)


@router.put("/{item_id}/status", status_code=status.HTTP_200_OK)
async def update_shopping_item_status(
    item_id: int,
    item: schemas.UpdateItem,
    session: Session = Depends(get_session),
    user: schemas.User = Depends(get_current_user),
):
    return await shopping_service.update_shopping_item_status(item_id, item, session)
