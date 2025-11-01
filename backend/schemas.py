from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    last_login: Optional[datetime]
    login_count: int

    class Config:
        orm_mode = True


class AdminCreate(BaseModel):
    email: EmailStr
    password: str


class AdminResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr

    class Config:
        orm_mode = True


class LoginRequest(BaseModel):
    username: str
    password: str
