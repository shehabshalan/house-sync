import os
from datetime import datetime, timedelta

import dotenv
from fastapi import HTTPException, status
from google.auth.transport import requests
from google.oauth2 import id_token
from jose import JWTError, jwt

dotenv.load_dotenv()

CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def generate_access_token(data: dict):
    try:
        if not SECRET_KEY:
            raise ValueError("No secret key configured for JWT")

        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    except JWTError:
        return None


def verify_google_token(token: str):
    try:
        if not CLIENT_ID:
            raise ValueError("No client ID configured for Google OAuth")
        id_info = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        return id_info
    except ValueError:
        return None


def verify_token(token: str):
    payload = None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as e:
        print(e)
    except AssertionError as e:
        print(e)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    return payload


def get_current_user(token: str = None):
    return verify_token(token)
