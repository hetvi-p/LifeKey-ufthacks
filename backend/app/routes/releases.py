from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from ..db import get_db
from .. import models, schemas
from ..crypto import decrypt_payload
from .audit import log
import os

router = APIRouter(prefix="", tags=["releases"])

SECRET = os.environ.get("AFTERME_RELEASE_SECRET", "dev-release-secret-change-me")
serializer = URLSafeTimedSerializer(SECRET, salt="afterme-release")

def make_release_token(release_id: int, recipient_id: int) -> str:
    return serializer.dumps({"release_id": release_id, "recipient_id": recipient_id})

def parse_release_token(token: str, max_age_seconds: int) -> dict:
    return serializer.loads(token, max_age=max_age_seconds)

@router.post("/claims/{claim_id}/issue-releases", response_model=list[schemas.ReleaseOut])
def issue_releases(claim_id: int, db: Session = Depends(get_db)):
    claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    if claim.status != "approved":
        raise HTTPException(status_code=400, detail="Claim must be approved first")

    policy = db.query(models.WillPolicy).filter(models.WillPolicy.id == claim.policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    # For hackathon: ignore dispute window timing; issue immediately.
    # Recipients that appear in assignments get releases.
    assignments = db.query(models.WillAssignment).filter(models.WillAssignment.policy_id == policy.id).all()
    recipient_ids = sorted({a.recipient_id for a in assignments})

    outputs: list[schemas.ReleaseOut] = []
    for rid in recipient_ids:
        expires_at = datetime.utcnow() + timedelta(hours=6)
        release = models.Release(
            claim_id=claim.id,
            recipient_id=rid,
            token="pending",
            expires_at=expires_at,
        )
        db.add(release)
        db.commit()
        db.refresh(release)

        token = make_release_token(release.id, rid)
        release.token = token
        db.commit()

        release_url = f"http://localhost:8000/release/{token}"
        outputs.append(schemas.ReleaseOut(release_url=release_url, expires_at=expires_at))
        log(db, actor="system", action="RELEASE_ISSUED", target_type="release", target_id=str(release.id), metadata={"recipient_id": rid})

    return outputs

@router.get("/release/{token}", response_model=schemas.ReleaseViewOut)
def view_release(token: str, db: Session = Depends(get_db)):
    # 6 hours max age to match issue expiry
    try:
        data = parse_release_token(token, max_age_seconds=6 * 3600)
    except SignatureExpired:
        raise HTTPException(status_code=401, detail="Release link expired")
    except BadSignature:
        raise HTTPException(status_code=401, detail="Invalid release link")

    release_id = int(data["release_id"])
    recipient_id = int(data["recipient_id"])

    release = db.query(models.Release).filter(models.Release.id == release_id).first()
    if not release or release.recipient_id != recipient_id:
        raise HTTPException(status_code=404, detail="Release not found")

    if datetime.utcnow() > release.expires_at:
        raise HTTPException(status_code=401, detail="Release link expired")

    # Fetch assigned items for this recipient via policy on the claim
    claim = db.query(models.Claim).filter(models.Claim.id == release.claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    policy_id = claim.policy_id
    rec = db.query(models.Recipient).filter(models.Recipient.id == recipient_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recipient not found")

    assigns = (
        db.query(models.WillAssignment)
        .filter(models.WillAssignment.policy_id == policy_id)
        .filter(models.WillAssignment.recipient_id == recipient_id)
        .all()
    )

    items = []
    for a in assigns:
        vi = db.query(models.VaultItem).filter(models.VaultItem.id == a.vault_item_id).first()
        if not vi:
            continue
        items.append(schemas.ReleasedItem(
            title=vi.title,
            type=vi.type,
            payload=decrypt_payload(vi.encrypted_payload),
            permission=a.permission,
        ))

    log(db, actor=f"recipient:{rec.email}", action="RELEASE_VIEWED", target_type="release", target_id=str(release.id))
    return schemas.ReleaseViewOut(recipient_email=rec.email, items=items)
