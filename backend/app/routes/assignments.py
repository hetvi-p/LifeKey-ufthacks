from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models, schemas
from ..auth import require_user_id
from .audit import log

router = APIRouter(prefix="/assignments", tags=["assignments"])

@router.post("")
def create_assignment(body: schemas.AssignmentCreate, db: Session = Depends(get_db), user_id: int = Depends(require_user_id)):
    policy = db.query(models.WillPolicy).filter(models.WillPolicy.id == body.policy_id).first()
    if not policy or policy.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Policy not found")

    # Basic ownership checks
    item = db.query(models.VaultItem).filter(models.VaultItem.id == body.vault_item_id).first()
    if not item or item.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Vault item not found")

    rec = db.query(models.Recipient).filter(models.Recipient.id == body.recipient_id).first()
    if not rec or rec.owner_id != user_id:
        raise HTTPException(status_code=404, detail="Recipient not found")

    a = models.WillAssignment(
        policy_id=body.policy_id,
        vault_item_id=body.vault_item_id,
        recipient_id=body.recipient_id,
        permission=body.permission,
    )
    db.add(a)
    db.commit()
    db.refresh(a)
    log(db, actor=f"user:{user_id}", action="ASSIGNMENT_CREATED", target_type="assignment", target_id=str(a.id))
    return {"id": a.id}
