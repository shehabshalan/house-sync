from datetime import datetime, timezone
from typing import List

from app import schemas
from app.db import get_session
from app.models import Space, SpaceUser, Task, TaskUser, User
from app.service import task_service
from app.utils import generate_due_dates
from app.utils.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_task(
    new_task: schemas.CreateTask,
    session: Session = Depends(get_session),
    user: schemas.User = Depends(get_current_user),
):
    return await task_service.create_task(new_task, session, user)


@router.put("/{task_id}/status", status_code=status.HTTP_200_OK)
async def update_task_status(
    task_id: int, session: Session = Depends(get_session), user: User = Depends(get_current_user)
):
    return await task_service.update_task_status(task_id, session, user)
