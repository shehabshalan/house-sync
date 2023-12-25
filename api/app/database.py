# models.py
from typing import Optional

from sqlmodel import Field, SQLModel, create_engine

DATABASE_URL = "postgresql://username:password@localhost/dbname"

database = create_engine(DATABASE_URL)


class Space(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True, index=True)
    name: str


class User(SQLModel, table=True):
    google_id: str
    email: str
    display_name: str
    profile_picture_url: Optional[str] = None


class Task(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True, index=True)
    description: str
    status: str = "to do"
    space_id: int
    user_id: int


class ShoppingItem(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True, index=True)
    name: str
    purchased: bool = False
    space_id: int
    user_id: int
