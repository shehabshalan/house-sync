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


class SpaceResponse(BaseModel):
    id: str
    name: str
    description: str
    picture: str
    owner_id: str
    owner_name: str
    owner_picture: str
    created_at: str
    updated_at: str
