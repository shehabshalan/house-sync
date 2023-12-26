from typing import Optional

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    email: str
    name: str
    picture: Optional[str] = None
