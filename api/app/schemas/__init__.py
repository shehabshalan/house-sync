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
