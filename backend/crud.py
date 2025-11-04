from sqlalchemy.orm import Session
import models, schemas, hashlib

def hash_password(password: str) -> str:
    """Hashes password using SHA256."""
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def create_user(db: Session, user: schemas.UserCreate):
    """Create a new user."""
    hashed_pw = hash_password(user.password)
    db_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=hashed_pw,
        login_timestamps="",
        logout_timestamps="",
        login_count=0
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": f"User {db_user.first_name} {db_user.last_name}  created successfully"}


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_all_users(db: Session):
    return db.query(models.User).all()

def append_login_timestamp(db: Session, user: models.User, login_time: str):
    """Append new login timestamp."""
    if user.login_timestamps:
        user.login_timestamps += f"\n{login_time}"
    else:
        user.login_timestamps = login_time

    user.login_count = (user.login_count or 0) + 1
    db.commit()
    db.refresh(user)
    return user.login_count


def append_logout_timestamp(db: Session, user: models.User, logout_time: str):
    """Append logout timestamp."""
    if user.logout_timestamps:
        user.logout_timestamps += f"\n{logout_time}"
    else:
        user.logout_timestamps = logout_time

    db.commit()
    db.refresh(user)
    return True


def get_user_sessions_from_user(db: Session, user: models.User):
    """Return structured login/logout pairs."""
    login_list = user.login_timestamps.strip().split("\n") if user.login_timestamps else []
    logout_list = user.logout_timestamps.strip().split("\n") if user.logout_timestamps else []

    sessions = []
    max_len = max(len(login_list), len(logout_list))
    for i in range(max_len):
        sessions.append({
            "index": i + 1,
            "login": {"timestamp": login_list[i]} if i < len(login_list) else None,
            "logout": {"timestamp": logout_list[i]} if i < len(logout_list) else None
        })
    return sessions
