# LifeKey Frontend

React + Vite frontend for LifeKey, a zero-knowledge digital inheritance platform.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client for API calls

## Features

### Owner Dashboard
- Create and manage digital will policies
- Add and manage recipients (beneficiaries)
- Add and manage vault items (accounts, passwords, crypto keys)
- Assign vault items to specific recipients
- View audit logs

### Recipient/Claim Flow
- Submit claims with ID documents and death certificates
- Identity verification with live photo capture
- View released items after approval

### Admin Dashboard
- Review and approve claims
- Issue release links for approved claims

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8000`

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Layout.jsx     # Main layout with sidebar navigation
│   │   ├── Card.jsx       # Card component
│   │   ├── Button.jsx     # Button component
│   │   ├── Input.jsx      # Input component
│   │   └── Modal.jsx      # Modal component
│   ├── pages/             # Page components
│   │   ├── LoginPage.jsx           # Authentication
│   │   ├── OwnerDashboard.jsx      # Owner main dashboard
│   │   ├── PolicyManagement.jsx    # Policy CRUD
│   │   ├── RecipientManagement.jsx # Recipient CRUD
│   │   ├── VaultItemManagement.jsx # Vault item CRUD
│   │   ├── AssignmentManagement.jsx # Assignment creation
│   │   ├── ClaimSubmission.jsx     # Claim submission form
│   │   ├── VerificationPage.jsx    # Identity verification
│   │   ├── ReleaseView.jsx         # View released items
│   │   ├── AdminDashboard.jsx      # Admin interface
│   │   └── AuditLog.jsx            # Audit trail viewer
│   ├── services/
│   │   └── api.js          # API service layer with axios
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles with Tailwind
├── package.json
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── postcss.config.js       # PostCSS configuration
```

## API Integration

The frontend communicates with the FastAPI backend through the `/api` proxy configured in `vite.config.js`. All API calls are made through the `api.js` service layer which handles:

- Authentication token management
- Request/response interceptors
- Error handling

### Authentication

Authentication tokens are stored in `localStorage` and automatically included in API requests via the `Authorization: Bearer <token>` header.

## Environment Variables

Currently, the API base URL is hardcoded to proxy to `http://localhost:8000` through Vite's proxy. To change this, update `vite.config.js`.

## Routes

- `/login` - Login page
- `/dashboard` - Owner dashboard (protected)
- `/policies` - Policy management (protected)
- `/recipients` - Recipient management (protected)
- `/vault-items` - Vault item management (protected)
- `/assignments` - Assignment management (protected)
- `/audit` - Audit log viewer (protected)
- `/claim` - Claim submission (public)
- `/verify/:claimId` - Identity verification (public)
- `/release/:token` - View released items (public)
- `/admin` - Admin dashboard (protected)

## Security Notes

- All authentication is token-based using Bearer tokens
- Tokens are stored in localStorage (consider httpOnly cookies for production)
- Sensitive data is handled by the backend's zero-knowledge encryption
- Passwords never travel through the frontend unencrypted

## Development Notes

- The verification page uses the browser's MediaDevices API for camera access
- File uploads for claims use FormData with multipart/form-data
- The frontend assumes the backend is running on port 8000 (adjust in vite.config.js if needed)
