import os
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models, schemas
from .audit import log

router = APIRouter(prefix="/claims", tags=["claims"])

UPLOAD_DIR = "app/../uploads"

@router.post("", response_model=schemas.ClaimOut)
def submit_claim(
    policy_id: int = Form(...),
    recipient_email: str = Form(...),
    legal_name: str = Form(...),
    dob: str = Form(...),
    id_doc: UploadFile = File(...),
    death_cert: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    policy = db.query(models.WillPolicy).filter(models.WillPolicy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    # Match recipient against policy owner’s recipient list (demo matching)
    rec = (
        db.query(models.Recipient)
        .filter(models.Recipient.owner_id == policy.owner_id)
        .filter(models.Recipient.email == recipient_email)
        .filter(models.Recipient.legal_name == legal_name)
        .filter(models.Recipient.dob == dob)
        .first()
    )
    if not rec:
        raise HTTPException(status_code=400, detail="Recipient identity did not match will")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    ts = int(datetime.utcnow().timestamp())
    id_path = os.path.join(UPLOAD_DIR, f"claim_{policy_id}_{rec.id}_{ts}_id_{id_doc.filename}")
    dc_path = os.path.join(UPLOAD_DIR, f"claim_{policy_id}_{rec.id}_{ts}_dc_{death_cert.filename}")

    with open(id_path, "wb") as f:
        f.write(id_doc.file.read())
    with open(dc_path, "wb") as f:
        f.write(death_cert.file.read())

    claim = models.Claim(
        policy_id=policy_id,
        submitted_by_recipient_id=rec.id,
        status="pending",
        id_doc_path=id_path,
        death_cert_path=dc_path,
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)

    log(db, actor=f"recipient:{rec.email}", action="CLAIM_SUBMITTED", target_type="claim", target_id=str(claim.id))
    return claim

@router.get("/{claim_id}", response_model=schemas.ClaimOut)
def get_claim(claim_id: int, db: Session = Depends(get_db)):
    claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim

@router.post("/{claim_id}/approve", response_model=schemas.ClaimOut)
def approve_claim(claim_id: int, admin_email: str = Form("admin@afterme.dev"), db: Session = Depends(get_db)):
    claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    claim.status = "approved"
    claim.reviewed_at = datetime.utcnow()
    claim.reviewed_by = admin_email
    db.commit()
    db.refresh(claim)
    log(db, actor=f"admin:{admin_email}", action="CLAIM_APPROVED", target_type="claim", target_id=str(claim.id))
    return claim
