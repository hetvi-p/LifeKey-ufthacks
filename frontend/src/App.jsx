import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authAPI } from './services/api';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OwnerDashboard from './pages/OwnerDashboard';
import PolicyManagement from './pages/PolicyManagement';
import RecipientManagement from './pages/RecipientManagement';
import VaultItemManagement from './pages/VaultItemManagement';
import AssignmentManagement from './pages/AssignmentManagement';
import ClaimSubmission from './pages/ClaimSubmission';
import VerificationPage from './pages/VerificationPage';
import ReleaseView from './pages/ReleaseView';
import AdminDashboard from './pages/AdminDashboard';
import AuditLog from './pages/AuditLog';

// Protected Route component
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    setIsAuthenticated(authAPI.isAuthenticated());
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Owner Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/policies" element={<ProtectedRoute><PolicyManagement /></ProtectedRoute>} />
        <Route path="/recipients" element={<ProtectedRoute><RecipientManagement /></ProtectedRoute>} />
        <Route path="/vault-items" element={<ProtectedRoute><VaultItemManagement /></ProtectedRoute>} />
        <Route path="/assignments" element={<ProtectedRoute><AssignmentManagement /></ProtectedRoute>} />
        <Route path="/audit" element={<ProtectedRoute><AuditLog /></ProtectedRoute>} />

        {/* Recipient Routes - Different UI/UX workflow */}
        <Route path="/claim" element={<ClaimSubmission />} />
        <Route path="/verify/:claimId" element={<VerificationPage />} />
        <Route path="/release/:token" element={<ReleaseView />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
