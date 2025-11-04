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
logged_in_users = {} 


@app.post("/admin/login")
def admin_login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Admin logs in."""
    global admin_authenticated
    admin = db.query(models.Admin).filter(models.Admin.email == login_data.username).first()

    if not admin or not auth.verify_password(login_data.password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials")

    admin_authenticated = True
    return {"message": "Admin logged in successfully", "redirect": "/admin"}


@app.post("/admin/logout")
def admin_logout():
    """Logs out admin."""
    global admin_authenticated
    if not admin_authenticated:
        raise HTTPException(status_code=403, detail="Admin not logged in")

    admin_authenticated = False
    return {"message": "Admin logged out successfully"}


@app.post("/admin/create_user")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Admin creates a new user."""
    if not admin_authenticated:
        raise HTTPException(status_code=403, detail="Admin not authenticated")
    return crud.create_user(db, user)


@app.get("/admin/users")
def get_all_users(db: Session = Depends(get_db)):
    """Admin can view all users."""
    if not admin_authenticated:
        raise HTTPException(status_code=403, detail="Admin not authenticated")

    users = crud.get_all_users(db)
    return [
        {
            "id": u.id,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "email": u.email,
            "login_count": u.login_count
        } for u in users
    ]

@app.get("/admin/user_sessions/{user_id}")
def get_user_sessions(user_id: int, db: Session = Depends(get_db)):
    """Admin views login & logout timestamps of a user."""
    global admin_authenticated

    if not admin_authenticated:
        raise HTTPException(status_code=403, detail="Admin not authenticated")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    sessions = crud.get_user_sessions_from_user(db, user)

    formatted = []
    for s in sessions:
        formatted.append({
            "login": s["login"]["timestamp"] if s.get("login") else None,
            "logout": s["logout"]["timestamp"] if s.get("logout") else None
        })

    return {"sessions": formatted}


@app.post("/user/login")
def user_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """User login — records timestamp + day (stored in same column)."""
    global logged_in_users

    user = crud.get_user_by_email(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    login_time = datetime.now().strftime("%A, %Y-%m-%d %H:%M:%S")
    index = crud.append_login_timestamp(db, user, login_time)

    logged_in_users[user.email] = index

    return {
        "message": f"Welcome {user.first_name} {user.last_name}",
        "email": user.email,
        "login_count": user.login_count,
        "last_login": login_time,
        "redirect": "/user/dashboard"
    }


@app.post("/user/logout")
def user_logout(db: Session = Depends(get_db)):
    """Logs out the currently logged-in user (no email required)."""
    global logged_in_users
    if not logged_in_users:
        raise HTTPException(status_code=401, detail="No user currently logged in")

    email = list(logged_in_users.keys())[0]
    index = logged_in_users[email]

    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    logout_time = datetime.now().strftime("%A, %Y-%m-%d %H:%M:%S")
    crud.append_logout_timestamp(db, user, logout_time)

    logged_in_users.pop(email, None)
    return {"message": "Logout successful", "logout_time": logout_time, "redirect": "/user/login"}


@app.get("/user/dashboard")
def user_dashboard(db: Session = Depends(get_db)):
    """Returns dashboard data for the currently logged-in user."""
    global logged_in_users
    if not logged_in_users:
        raise HTTPException(status_code=401, detail="No user currently logged in")

    email = list(logged_in_users.keys())[0]
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    sessions = crud.get_user_sessions_from_user(db, user)
    login_list = [s["login"]["timestamp"] for s in sessions if s.get("login")]
    logout_list = [s["logout"]["timestamp"] for s in sessions if s.get("logout")]

    last_login = login_list[-1] if login_list else None

    return {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "login_timestamps": login_list
    }


