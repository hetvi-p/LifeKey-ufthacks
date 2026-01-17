from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from .db import Base, engine, get_db
from . import models, schemas
from .auth import hash_password, make_token, verify_password
from .routes import policies, recipients, vault_items, assignments, claims, releases
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="LifeKey API", version="0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # lock down later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/register", response_model=schemas.LoginOut, tags=["auth"])
def register(body: schemas.RegisterIn, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == str(body.email)).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    salt, password_hash = hash_password(body.password)
    user = models.User(
        email=str(body.email),
        name=body.name,
        password_salt=salt,
        password_hash=password_hash,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return schemas.LoginOut(token=make_token(user.id), user_id=user.id)

@app.post("/auth/login", response_model=schemas.LoginOut, tags=["auth"])
def login(body: schemas.LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == str(body.email)).first()
    if not user or not verify_password(body.password, user.password_salt, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return schemas.LoginOut(token=make_token(user.id), user_id=user.id)

# Routers
app.include_router(policies.router)
app.include_router(recipients.router)
app.include_router(vault_items.router)
app.include_router(assignments.router)
app.include_router(claims.router)
app.include_router(releases.router)
