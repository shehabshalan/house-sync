from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class User(SQLModel, table=True):
    email: str = Field(primary_key=True, unique=True, index=True)
    name: Optional[str] = None
    picture: Optional[str] = None
    is_active: bool = False
    spaces: List["Space"] = Relationship(back_populates="users")


class Space(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, index=True, unique=True)
    name: str
    owner_email: str = Field(default=None, foreign_key="user.email")
    description: str
    users: List["User"] = Relationship(back_populates="spaces")


class SpaceUser(SQLModel, table=True):
    space_id: int = Field(primary_key=True, default=None, foreign_key="space.id")
    user_email: str = Field(primary_key=True, default=None, foreign_key="user.email")
