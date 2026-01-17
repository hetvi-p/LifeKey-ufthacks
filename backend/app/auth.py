from fastapi import Header, HTTPException
from itsdangerous import URLSafeSerializer
import os

SECRET = os.environ.get("AFTERME_AUTH_SECRET", "dev-secret-change-me")
serializer = URLSafeSerializer(SECRET, salt="afterme-auth")

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
