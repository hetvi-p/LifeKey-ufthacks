import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { policiesAPI, recipientsAPI, vaultItemsAPI } from '../services/api';
import { FileText, Users, Lock, ArrowRight, Plus } from 'lucide-react';

export default function OwnerDashboard() {
  const [stats, setStats] = useState({
    policies: 0,
    recipients: 0,
    vaultItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [policies, recipients, vaultItems] = await Promise.all([
        policiesAPI.list(),
        recipientsAPI.list(),
        vaultItemsAPI.list(),
      ]);
      setStats({
        policies: policies.length,
        recipients: recipients.length,
        vaultItems: vaultItems.length,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your digital will and delegate access to your accounts</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Policies</p>
                <p className="text-3xl font-bold text-gray-900">{stats.policies}</p>
              </div>
              <div className="bg-primary-100 rounded-full p-3">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <Link to="/policies" className="mt-4 flex items-center text-primary-600 text-sm font-medium">
              Manage policies <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Recipients</p>
                <p className="text-3xl font-bold text-gray-900">{stats.recipients}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <Link to="/recipients" className="mt-4 flex items-center text-primary-600 text-sm font-medium">
              Manage recipients <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Vault Items</p>
                <p className="text-3xl font-bold text-gray-900">{stats.vaultItems}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <Link to="/vault-items" className="mt-4 flex items-center text-primary-600 text-sm font-medium">
              Manage vault items <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/policies">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Plus className="w-5 h-5 text-primary-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Create New Policy</h3>
                    <p className="text-sm text-gray-600">Set up a new digital will</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/assignments">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-primary-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Assign Accounts</h3>
                    <p className="text-sm text-gray-600">Delegate vault items to recipients</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </Card>

        {/* Getting Started Guide */}
        {stats.policies === 0 && (
          <Card className="mt-8 bg-primary-50 border-primary-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Getting Started</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Create a policy (digital will) to get started</li>
              <li>Add recipients (beneficiaries) who will receive access</li>
              <li>Add vault items (accounts, passwords, crypto keys) to delegate</li>
              <li>Assign specific vault items to specific recipients</li>
              <li>All data is encrypted - we never see your passwords</li>
            </ol>
            <Link to="/policies">
              <Button className="mt-4">Create Your First Policy</Button>
            </Link>
          </Card>
        )}
      </div>
    </Layout>
  );
}
