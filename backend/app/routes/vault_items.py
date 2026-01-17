from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models, schemas
from ..auth import require_user_id
from ..crypto import encrypt_payload
from .audit import log

router = APIRouter(prefix="/vault-items", tags=["vault-items"])

@router.post("", response_model=schemas.VaultItemOut)
def create_item(body: schemas.VaultItemCreate, db: Session = Depends(get_db), user_id: int = Depends(require_user_id)):
    item = models.VaultItem(
        owner_id=user_id,
        title=body.title,
        type=body.type,
        encrypted_payload=encrypt_payload(body.payload),
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    log(db, actor=f"user:{user_id}", action="VAULT_ITEM_CREATED", target_type="vault_item", target_id=str(item.id))
    return item

@router.get("/me", response_model=list[schemas.VaultItemOut])
def list_my_items(db: Session = Depends(get_db), user_id: int = Depends(require_user_id)):
    return db.query(models.VaultItem).filter(models.VaultItem.owner_id == user_id).all()
