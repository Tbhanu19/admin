from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from database import engine, get_db
import models, schemas, crud, auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Access Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

admin_authenticated = False
logged_in_users = set()

@app.post("/admin/login")
def admin_login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    """
    Admin login — verifies credentials and sets admin_authenticated = True
    """
    global admin_authenticated
    admin = db.query(models.Admin).filter(models.Admin.email == login_data.username).first()

    if not admin or not auth.verify_password(login_data.password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials")

    admin_authenticated = True  
    return {"message": "Admin logged in successfully"}


@app.post("/admin/create_user")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Admin creates new user (only if logged in)
    """
    if not admin_authenticated:
        raise HTTPException(status_code=403, detail="Admin not authenticated")
    return crud.create_user(db, user)


@app.get("/admin/users")
def get_all_users(db: Session = Depends(get_db)):
    """
    Admin fetches all user records (only if logged in)
    """
    if not admin_authenticated:
        raise HTTPException(status_code=403, detail="Admin not authenticated")
    return crud.get_all_users(db)

@app.post("/admin/logout")
def admin_logout():
    """
    Clears admin login session
    """
    global admin_authenticated
    if not admin_authenticated:
        raise HTTPException(status_code=403, detail="Admin not logged in")

    admin_authenticated = False
    return {"message": "Admin logged out successfully"}


@app.post("/user/login")
def user_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    global logged_in_users
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    crud.update_user_timestamp(db, user)
    logged_in_users.add(user.email)

    return {
        "message": f"Welcome {user.first_name} {user.last_name}",
        "email": user.email,
        "login_count": user.login_count,
        "timestamp": user.timestamp,
    }

@app.get("/user/dashboard")
def user_dashboard(db: Session = Depends(get_db)):
    """Dashboard only accessible if the user has logged in successfully."""
    if not logged_in_users:
        raise HTTPException(status_code=403, detail="No active user session")

    email = list(logged_in_users)[-1]
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
       "message": f"Welcome {user.first_name} {user.last_name}"
    }