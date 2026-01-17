import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Shield } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Trim whitespace from inputs
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    
    // Basic validation
    if (!trimmedEmail || !trimmedName) {
      setError('Please enter both email and name');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);

    try {
      await authAPI.login(trimmedEmail, trimmedName);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      
      // DEV MODE: If backend is not running, allow UI navigation with mock auth
      if (!err.response || err.response.status === 500 || err.code === 'ECONNREFUSED') {
        // Backend not running - use mock auth for UI development
        console.log('DEV MODE: Backend not available, using mock authentication');
        localStorage.setItem('token', 'dev-mock-token');
        localStorage.setItem('user_id', '1');
        navigate('/dashboard');
        return;
      }
      
      // Handle other error types
      if (err.response.status >= 400 && err.response.status < 500) {
        // Client error (validation, etc.)
        setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
      } else {
        // Other errors
        setError(err.response?.data?.detail || err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 rounded-2xl p-4">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">LifeKey</h1>
          <p className="text-gray-600">Your digital legacy shouldn't die with you</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign In / Sign Up</h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter any email and name to get started. If you're new, we'll create your account automatically.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />

            <Input
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Continue'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            By signing in, you agree to LifeKey's terms of service and privacy policy.
            <br />
            <span className="text-primary-600">Zero-knowledge encryption ensures we never see your passwords.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
