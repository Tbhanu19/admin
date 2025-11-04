
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    login_count: int

    class Config:
        orm_mode = True

class SessionEntry(BaseModel):
    index: int
    login: Optional[Any] = None
    logout: Optional[Any] = None


class LoginRequest(BaseModel):
    username: str
    password: str
