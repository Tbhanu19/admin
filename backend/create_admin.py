from database import SessionLocal, engine
from models import Admin, Base
from auth import get_password_hash


Base.metadata.create_all(bind=engine)

def create_admin():
    db = SessionLocal()

    existing = db.query(Admin).filter(Admin.email == "admin@gmail.com").first()
    if existing:
        print("Admin already exists.")
        db.close()
        return

    admin = Admin(
        first_name="Super",
        last_name="Admin",
        email="admin@gmail.com",
        password_hash=get_password_hash("Admin@123")
    )

    db.add(admin)
    db.commit()
    db.close()
    print("Admin created successfully!")

if __name__ == "__main__":
    create_admin()
