import hashlib
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import HTTPException, status


SECRET_KEY = "SUPER_SECRET_KEY_CHANGE_ME" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def _sha256(text: str) -> str:
    """Return hex SHA-256 for the given text."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def get_password_hash(password: str) -> str:
    """
    Hash a plain password using SHA-256.
    Note: This is lightweight. For production use bcrypt/argon2 with salt.
    """
    return _sha256(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a SHA-256 hex digest."""
    try:
        return _sha256(plain_password) == hashed_password
    except Exception:
        return False



def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
