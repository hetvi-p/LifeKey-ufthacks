from sqlalchemy.orm import Session
from .. import models
import json

def log(db: Session, actor: str, action: str, target_type: str, target_id: str, metadata: dict | None = None):
    evt = models.AuditEvent(
        actor=actor,
        action=action,
        target_type=target_type,
        target_id=str(target_id),
        metadata_json=json.dumps(metadata or {}),
    )
    db.add(evt)
    db.commit()
