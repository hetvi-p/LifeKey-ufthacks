from fastapi import Header, HTTPException
from itsdangerous import URLSafeSerializer
import hashlib
import hmac
import os
import secrets

SECRET = os.environ.get("AFTERME_AUTH_SECRET", "dev-secret-change-me")
serializer = URLSafeSerializer(SECRET, salt="afterme-auth")
PASSWORD_ITERATIONS = 120_000

def make_token(user_id: int) -> str:
    return serializer.dumps({"user_id": user_id})

def require_user_id(authorization: str | None = Header(default=None)) -> int:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = authorization.split(" ", 1)[1]
    try:
        data = serializer.loads(token)
        return int(data["user_id"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

def hash_password(password: str, salt: str | None = None) -> tuple[str, str]:
    if salt is None:
        salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        PASSWORD_ITERATIONS,
    ).hex()
    return salt, digest

def verify_password(password: str, salt: str, expected_hash: str) -> bool:
    _, digest = hash_password(password, salt=salt)
    return hmac.compare_digest(digest, expected_hash)
