from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from itsdangerous import URLSafeSerializer
import hashlib, hmac, os, secrets

SECRET = os.environ.get("AFTERME_AUTH_SECRET", "dev-secret-change-me")
serializer = URLSafeSerializer(SECRET, salt="afterme-auth")

security = HTTPBearer(auto_error=False)
PASSWORD_ITERATIONS = 120_000

def make_token(user_id: int) -> str:
    return serializer.dumps({"user_id": user_id})

def require_user_id(creds: HTTPAuthorizationCredentials = Depends(security)) -> int:
    if creds is None or creds.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = creds.credentials
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
