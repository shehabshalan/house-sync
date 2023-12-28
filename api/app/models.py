import enum
from typing import List, Optional

from sqlmodel import Column, Enum, Field, Relationship, SQLModel


class User(SQLModel, table=True):
    email: str = Field(primary_key=True, unique=True, index=True)
    name: Optional[str] = None
    picture: Optional[str] = None
    is_active: bool = False
    spaces: List["Space"] = Relationship(back_populates="users")


class TaskFrequency(str, enum.Enum):
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"


class Space(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, index=True, unique=True)
    name: str
    owner_email: str = Field(default=None, foreign_key="user.email")
    description: str
    users: List["User"] = Relationship(back_populates="spaces")


class SpaceUser(SQLModel, table=True):
    space_id: int = Field(primary_key=True, default=None, foreign_key="space.id")
    user_email: str = Field(primary_key=True, default=None, foreign_key="user.email")


class Task(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, index=True)
    name: str
    description: str
    frequency: TaskFrequency = Field(sa_column=Column(Enum(TaskFrequency)))
    space_id: int = Field(default=None, foreign_key="space.id")


class TaskUser(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, index=True)
    task_id: int = Field(default=None, foreign_key="task.id")
    user_email: str = Field(default=None, foreign_key="user.email")
    is_completed: bool = False
    due_date: Optional[str] = None
