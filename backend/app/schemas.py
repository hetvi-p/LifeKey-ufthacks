from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional, List
from datetime import datetime

class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

class RegisterIn(BaseModel):
    email: EmailStr
    name: str = Field(min_length=1)
    password: str = Field(min_length=8)

class LoginOut(BaseModel):
    token: str
    user_id: int

class PolicyCreate(BaseModel):
    dispute_window_hours: int = 24

class PolicyOut(BaseModel):
    id: int
    owner_id: int
    status: str
    dispute_window_hours: int
    created_at: datetime

class RecipientCreate(BaseModel):
    email: EmailStr
    legal_name: str
    dob: str  # YYYY-MM-DD (demo)

class RecipientOut(BaseModel):
    id: int
    owner_id: int
    email: EmailStr
    legal_name: str
    dob: str
    created_at: datetime

class VaultItemCreate(BaseModel):
    title: str
    type: Literal["login", "secure_note", "crypto_wallet"]
    payload: dict  # will be encrypted server-side

class VaultItemOut(BaseModel):
    id: int
    owner_id: int
    title: str
    type: str
    created_at: datetime

class AssignmentCreate(BaseModel):
    policy_id: int
    vault_item_id: int
    recipient_id: int
    permission: Literal["view", "export"] = "view"

class ClaimCreate(BaseModel):
    policy_id: int
    recipient_email: EmailStr
    legal_name: str
    dob: str

class ClaimOut(BaseModel):
    id: int
    policy_id: int
    submitted_by_recipient_id: int
    status: str
    created_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewed_by: str = ""

class ReleaseOut(BaseModel):
    release_url: str
    expires_at: datetime

class ReleasedItem(BaseModel):
    title: str
    type: str
    payload: dict
    permission: str

class ReleaseViewOut(BaseModel):
    recipient_email: EmailStr
    items: List[ReleasedItem]
