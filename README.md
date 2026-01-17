# LifeKey

**Your digital legacy shouldn't die with you.**

LifeKey is a secure, zero-knowledge digital inheritance platform that ensures your loved ones can access critical accounts and credentials after you pass away — without compromising security while you're alive.


**Introduction**

LifeKey is a zero-knowledge digital inheritance platform that solves a $20 billion problem: when someone dies, their digital assets — from cryptocurrency wallets to bank accounts to cherished photo libraries — become permanently inaccessible, leaving families locked out and executors unable to fulfill their legal duties. Unlike traditional password managers that die with their owners or unsafe alternatives like writing passwords on paper, LifeKey uses client-side encryption to let you securely delegate specific accounts to chosen beneficiaries who can only decrypt them after multi-stage verification including AI-powered ID matching, death certificate validation, a mandatory waiting period with owner notification rights, and signed legal agreements — ensuring your loved ones inherit your digital legacy without compromising security while you're alive, because your passwords decrypt on their device, not ours, and even we can't see them.


## The Problem

When someone dies, their digital life becomes inaccessible:
- **$20B+ in crypto** is permanently lost due to lost private keys
- Families are locked out of bank accounts, email, and social media
- Password managers die with their owners
- No "forgot password" for the deceased
- Executors can't fulfill their legal duties without access

Current solutions are broken:
- Writing passwords down → security risk, can be lost/destroyed
- Sharing with family → defeats the purpose of security
- Safe deposit boxes → family doesn't know they exist
- Existing services → expensive, not widely adopted, often unreliable

## Our Solution

LifeKey uses **zero-knowledge encryption** to create a secure digital will for your passwords and credentials. You choose exactly who gets access to what, and they can only decrypt after:

1. ✅ **Identity verification** (AI-powered ID + selfie matching)
2. ✅ **Death verification** (certificate + executor docs OR 2-of-3 trusted contacts)
3. ✅ **Mandatory waiting period** (7-30 days with owner notification)
4. ✅ **Legal agreement** (signed terms of use)

### Key Features

**For Account Owners:**
- Select specific accounts to delegate (crypto wallets, devices, email, social media, banking)
- Assign different beneficiaries for different accounts
- Set custom waiting periods and verification requirements
- "I'm alive" check-ins prevent false triggers
- Cancel access requests anytime

**For Beneficiaries:**
- Secure email link with unique access portal
- Step-by-step verification process
- Client-side decryption (passwords never exposed in transit)
- Clear legal framework and audit trail

**Security Architecture:**
- 🔐 **Zero-knowledge encryption** - we never see your passwords
- 🔑 **Key wrapping** - decryption keys encrypted for specific beneficiaries
- 🛡️ **Client-side decryption** - passwords decrypt on user's device only
- 📝 **Immutable audit logs** - all actions recorded
- ⏰ **Dead-man switch** - owner must check in periodically

## How It Works

### Encryption Flow
Instead of storing plaintext passwords, LifeKey stores:
```
encrypted_password + wrapped_decryption_key
```

The decryption key is cryptographically "wrapped" (encrypted) specifically for the beneficiary. Only after all verification steps pass does the beneficiary receive the wrapped key to decrypt locally.

**Result:** Even a database breach exposes nothing. Even LifeKey itself cannot decrypt your passwords.

### Access Release Flow
1. Owner delegates accounts to beneficiary (identity verified)
2. Owner passes away
3. Beneficiary requests access via email link
4. Verification begins:
   - Upload death certificate + executor documents
   - OR get approval from 2-of-3 trusted contacts
   - Upload government ID
   - Take live selfie (AI facial matching)
   - Sign legal usage agreement
5. Waiting period starts (owner gets notified, can cancel)
6. After waiting period expires → beneficiary gets wrapped key
7. Passwords decrypt locally on beneficiary's device

## Tech Stack

**Frontend:**
- React + Vite
- Tailwind CSS
- Lucide icons

**Backend:**
- Node.js + Express
- PostgreSQL (encrypted vault storage)
- Web Crypto API for encryption

**AI/ML:**
- Document verification (OCR + validation)
- Facial recognition (ID photo vs. live selfie)
- Liveness detection (prevent photo spoofing)

**Security:**
- AES-256-GCM encryption
- RSA key wrapping
- PBKDF2 key derivation
- Zero-knowledge architecture

## Use Cases

- **Crypto holders** - Ensure heirs can access wallets without writing seed phrases on paper
- **Business owners** - Transfer critical access to partners or successors
- **Families** - Give loved ones access to accounts, photos, and memories
- **Executors** - Enable legal representatives to fulfill their duties
- **Digital nomads** - Protect access to devices and accounts across borders

## What Makes This Different

1. **True zero-knowledge** - Unlike password managers, we can't see your passwords even if we wanted to
2. **Granular control** - Delegate specific accounts to specific people
3. **Multi-factor verification** - Not just a death certificate — AI verification + legal docs + waiting period
4. **Abuse prevention** - Owner notification, cancellation rights, audit trails
5. **Legal framework** - Signed agreements protect all parties

## Roadmap

**Hackathon MVP (36 hours):**
- [x] Owner vault UI with account selection
- [x] Beneficiary information collection
- [x] ID verification flow (document + selfie)
- [x] Legal agreement signing
- [ ] Backend encryption implementation
- [ ] Email notification system
- [ ] Beneficiary access portal

**Future Features:**
- Multi-signature verification (require 3-of-5 contacts to approve)
- Video message from owner (plays after death)
- Timed auto-destruction of sensitive data
- Integration with existing password managers
- Estate planning attorney network
- Blockchain-based audit trail
- Mobile app with biometric security

## Team

Built at UofTHacks 13 by Hetvi Patel, Sandy Banh

## License


---

**LifeKey** - Because your digital legacy matters.