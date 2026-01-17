from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .db import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    password_salt: Mapped[str] = mapped_column(String(64))
    password_hash: Mapped[str] = mapped_column(String(128))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    policies = relationship("WillPolicy", back_populates="owner")

class VaultItem(Base):
    __tablename__ = "vault_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    type: Mapped[str] = mapped_column(String(50))  # login | secure_note | crypto_wallet
    encrypted_payload: Mapped[str] = mapped_column(Text)  # encrypted JSON
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Recipient(Base):
    __tablename__ = "recipients"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    email: Mapped[str] = mapped_column(String(255), index=True)
    legal_name: Mapped[str] = mapped_column(String(255))
    dob: Mapped[str] = mapped_column(String(20))  # demo: YYYY-MM-DD
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class WillPolicy(Base):
    __tablename__ = "will_policies"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    status: Mapped[str] = mapped_column(String(20), default="active")  # active|paused
    dispute_window_hours: Mapped[int] = mapped_column(Integer, default=24)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="policies")
    assignments = relationship("WillAssignment", back_populates="policy")

class WillAssignment(Base):
    __tablename__ = "will_assignments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    policy_id: Mapped[int] = mapped_column(ForeignKey("will_policies.id"), index=True)
    vault_item_id: Mapped[int] = mapped_column(ForeignKey("vault_items.id"), index=True)
    recipient_id: Mapped[int] = mapped_column(ForeignKey("recipients.id"), index=True)
    permission: Mapped[str] = mapped_column(String(20), default="view")  # view|export
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    policy = relationship("WillPolicy", back_populates="assignments")

class Claim(Base):
    __tablename__ = "claims"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    policy_id: Mapped[int] = mapped_column(ForeignKey("will_policies.id"), index=True)
    submitted_by_recipient_id: Mapped[int] = mapped_column(ForeignKey("recipients.id"), index=True)
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending|approved|denied
    id_doc_path: Mapped[str] = mapped_column(String(500), default="")
    death_cert_path: Mapped[str] = mapped_column(String(500), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    reviewed_by: Mapped[str] = mapped_column(String(255), default="")  # admin email

class Release(Base):
    __tablename__ = "releases"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    claim_id: Mapped[int] = mapped_column(ForeignKey("claims.id"), index=True)
    recipient_id: Mapped[int] = mapped_column(ForeignKey("recipients.id"), index=True)
    token: Mapped[str] = mapped_column(String(500), unique=True, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class AuditEvent(Base):
    __tablename__ = "audit_events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    actor: Mapped[str] = mapped_column(String(255))
    action: Mapped[str] = mapped_column(String(50))
    target_type: Mapped[str] = mapped_column(String(50))
    target_id: Mapped[str] = mapped_column(String(50))
    metadata_json: Mapped[str] = mapped_column(Text, default="{}")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
