from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models, schemas
from ..auth import require_user_id
from .audit import log

router = APIRouter(prefix="/recipients", tags=["recipients"])

@router.post("", response_model=schemas.RecipientOut)
def add_recipient(body: schemas.RecipientCreate, db: Session = Depends(get_db), user_id: int = Depends(require_user_id)):
    rec = models.Recipient(
        owner_id=user_id,
        email=str(body.email),
        legal_name=body.legal_name,
        dob=body.dob,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    log(db, actor=f"user:{user_id}", action="RECIPIENT_ADDED", target_type="recipient", target_id=str(rec.id), metadata={"email": rec.email})
    return rec

@router.get("/me", response_model=list[schemas.RecipientOut])
def list_my_recipients(db: Session = Depends(get_db), user_id: int = Depends(require_user_id)):
    return db.query(models.Recipient).filter(models.Recipient.owner_id == user_id).all()
