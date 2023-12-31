from datetime import datetime, timezone

from app import schemas
from app.models import Space, SpaceUser, Task, TaskUser, User
from app.utils import generate_due_dates
from fastapi import HTTPException, status
from sqlmodel import Session, select


async def create_task(new_task: schemas.CreateTask, session: Session, user: schemas.User):
    space = session.exec(select(Space).where(Space.id == new_task.space_id, Space.owner_email == user["email"])).first()
    if not space:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is not the owner of the space")
    try:
        task = Task(
            name=new_task.name,
            description=new_task.description,
            frequency=new_task.frequency,
            space_id=new_task.space_id,
            start_date=new_task.start_date,
        )
        session.add(task)
        session.commit()
        session.refresh(task)
        users_in_space = session.exec(
            select(User).join(SpaceUser).where(SpaceUser.space_id == new_task.space_id).order_by(User.name)
        ).all()
        start_date = datetime.fromtimestamp(new_task.start_date).replace(tzinfo=timezone.utc)
        due_dates = generate_due_dates(start_date, new_task.frequency, len(users_in_space))

        for i, user in enumerate(users_in_space):
            task_user = TaskUser(
                task_id=task.id,
                user_email=user.email,
                due_date=due_dates[i],
            )
            session.add(task_user)

        session.commit()
        return {"message": "Task created successfully"}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


async def update_task_status(task_id: int, session: Session, user: schemas.User):
    task_user = session.exec(
        select(TaskUser).where(TaskUser.task_id == task_id, TaskUser.user_email == user["email"])
    ).first()
    if not task_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is not associated with the task")

    task_user.is_completed = True
    session.add(task_user)
    session.commit()
    session.refresh(task_user)

    all_completed = (
        session.exec(select(TaskUser).where(TaskUser.task_id == task_id, TaskUser.is_completed == False)).first()
        is None
    )

    if all_completed:
        users_in_task = session.exec(
            select(TaskUser).where(TaskUser.task_id == task_id).order_by(TaskUser.user_email)
        ).all()
        last_user = users_in_task[-1]
        last_user_due_date = last_user.due_date + ":00"
        task = session.exec(select(Task).where(Task.id == task_id)).first()
        start_date = datetime.strptime(last_user_due_date, "%Y-%m-%d %H:%M:%S%z")
        num_users = session.exec(select(TaskUser).where(TaskUser.task_id == task_id)).all()
        due_dates = generate_due_dates(start_date, task.frequency, len(num_users))
        for i, user_email in enumerate(
            session.exec(select(TaskUser.user_email).where(TaskUser.task_id == task_id)).all()
        ):
            task_user = session.exec(
                select(TaskUser).where(TaskUser.task_id == task_id, TaskUser.user_email == user_email)
            ).first()
            task_user.due_date = due_dates[i]
            task_user.is_completed = False

    session.commit()
    return {"message": "Task status updated successfully"}
