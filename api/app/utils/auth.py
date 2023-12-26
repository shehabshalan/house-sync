import os
from datetime import datetime, timedelta

import dotenv
from google.auth.transport import requests
from google.oauth2 import id_token
from jose import JWTError, jwt

dotenv.load_dotenv()

CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1


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
        id_info = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        return id_info
    except ValueError:
        return None


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
