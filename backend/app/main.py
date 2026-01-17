from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .db import Base, engine, get_db
from . import models, schemas
from .auth import make_token
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

@app.post("/auth/login", response_model=schemas.LoginOut, tags=["auth"])
def login(body: schemas.LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == str(body.email)).first()
    if not user:
        user = models.User(email=str(body.email), name=body.name)
        db.add(user)
        db.commit()
        db.refresh(user)
    return schemas.LoginOut(token=make_token(user.id), user_id=user.id)

# Routers
app.include_router(policies.router)
app.include_router(recipients.router)
app.include_router(vault_items.router)
app.include_router(assignments.router)
app.include_router(claims.router)
app.include_router(releases.router)
