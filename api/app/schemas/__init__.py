from enum import Enum
from typing import List

from pydantic import BaseModel


class UserToken(BaseModel):
    token: str


class User(BaseModel):
    email: str
    name: str | None = None
    picture: str | None = None
    is_active: bool


class UserResponse(UserToken, User):
    pass


class GetSpace(BaseModel):
    id: int
    name: str
    description: str
    owner_email: str
    users: List[User]


class CreateSpace(BaseModel):
    name: str
    description: str


class InviteUser(BaseModel):
    space_id: int
    emails: List[str]


class TaskFrequency(str, Enum):
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"


class CreateTask(BaseModel):
    name: str
    description: str
    frequency: TaskFrequency
    start_date: int
    space_id: int


class GetTask(CreateTask):
    id: int


class GetShoppingList(BaseModel):
    id: int
    item: str
    quantity: int
    space_id: int
    is_purshased: bool
    purchased_by: str


class CreateItem(BaseModel):
    item: str
    quantity: int
    space_id: int


class UpdateItem(BaseModel):
    is_purchased: bool
    purchased_by: str
