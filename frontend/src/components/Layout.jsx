import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { 
  Home, 
  FileText, 
  Users, 
  Lock, 
  Link2, 
  History,
  LogOut,
  Shield
} from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/policies', icon: FileText, label: 'Policies' },
    { path: '/recipients', icon: Users, label: 'Recipients' },
    { path: '/vault-items', icon: Lock, label: 'Vault Items' },
    { path: '/assignments', icon: Link2, label: 'Assignments' },
    { path: '/audit', icon: History, label: 'Audit Log' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <Shield className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">LifeKey</h1>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
