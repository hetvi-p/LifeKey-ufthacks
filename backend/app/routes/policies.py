from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models, schemas
from ..auth import require_user_id
from .audit import log

router = APIRouter(prefix="/policies", tags=["policies"])

@router.post("", response_model=schemas.PolicyOut)
def create_policy(body: schemas.PolicyCreate, db: Session = Depends(get_db), user_id: int = Depends(require_user_id)):
    policy = models.WillPolicy(owner_id=user_id, dispute_window_hours=body.dispute_window_hours)
    db.add(policy)
    db.commit()
    db.refresh(policy)
    log(db, actor=f"user:{user_id}", action="POLICY_CREATED", target_type="policy", target_id=str(policy.id))
    return policy

@router.get("/me", response_model=list[schemas.PolicyOut])
def list_my_policies(db: Session = Depends(get_db), user_id: int = Depends(require_user_id)):
    return db.query(models.WillPolicy).filter(models.WillPolicy.owner_id == user_id).all()
