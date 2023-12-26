from pydantic import BaseModel


class UserToken(BaseModel):
    token: str


class User(BaseModel):
    id: str
    email: str
    name: str
    picture: str


class UserResponse(UserToken, User):
    pass
