import json
import os
from cryptography.fernet import Fernet

# Hackathon-friendly: one server key for demo.
# In real life: per-vault DEKs + KEK wrapping.
FERNET_KEY = os.environ.get("AFTERME_FERNET_KEY")
if not FERNET_KEY:
    # Generate deterministic dev key if none provided (fine for hackathon).
    # For production, never auto-generate.
    FERNET_KEY = Fernet.generate_key().decode()

fernet = Fernet(FERNET_KEY.encode() if isinstance(FERNET_KEY, str) else FERNET_KEY)

def encrypt_payload(payload: dict) -> str:
    raw = json.dumps(payload).encode("utf-8")
    return fernet.encrypt(raw).decode("utf-8")

def decrypt_payload(token: str) -> dict:
    raw = fernet.decrypt(token.encode("utf-8"))
    return json.loads(raw.decode("utf-8"))
