import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { policiesAPI } from '../services/api';
import { Plus, FileText, CheckCircle, Clock } from 'lucide-react';

export default function PolicyManagement() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [disputeWindow, setDisputeWindow] = useState(24);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const data = await policiesAPI.list();
      setPolicies(data);
    } catch (err) {
      console.error('Failed to load policies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await policiesAPI.create(disputeWindow);
      await loadPolicies();
      setShowCreateModal(false);
      setDisputeWindow(24);
    } catch (err) {
      console.error('Failed to create policy:', err);
      alert('Failed to create policy. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Policies</h1>
            <p className="text-gray-600">Manage your digital will policies</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-5 h-5 inline mr-2" />
            Create Policy
          </Button>
        </div>

        {policies.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No policies yet</h3>
              <p className="text-gray-600 mb-4">Create your first digital will policy to get started</p>
              <Button onClick={() => setShowCreateModal(true)}>Create Policy</Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <Card key={policy.id}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Policy #{policy.id}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Created {new Date(policy.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {policy.status === 'active' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      policy.status === 'active' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {policy.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Dispute Window:</span>
                    <span className="font-medium text-gray-900">{policy.dispute_window_hours}h</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Policy"
        >
          <form onSubmit={handleCreatePolicy}>
            <Input
              label="Dispute Window (hours)"
              type="number"
              value={disputeWindow}
              onChange={(e) => setDisputeWindow(parseInt(e.target.value) || 24)}
              placeholder="24"
              required
            />
            <p className="mt-2 text-sm text-gray-600 mb-4">
              The dispute window is the waiting period before recipients can access their assigned items after a claim is approved.
            </p>
            <div className="flex space-x-3">
              <Button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create Policy'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
