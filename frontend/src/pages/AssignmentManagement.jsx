import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { assignmentsAPI, policiesAPI, recipientsAPI, vaultItemsAPI } from '../services/api';
import { Link2, Plus, CheckCircle } from 'lucide-react';

export default function AssignmentManagement() {
  const [policies, setPolicies] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [vaultItems, setVaultItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    policy_id: '',
    vault_item_id: '',
    recipient_id: '',
    permission: 'view',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [policiesData, recipientsData, vaultItemsData] = await Promise.all([
        policiesAPI.list(),
        recipientsAPI.list(),
        vaultItemsAPI.list(),
      ]);
      setPolicies(policiesData);
      setRecipients(recipientsData);
      setVaultItems(vaultItemsData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await assignmentsAPI.create(
        parseInt(formData.policy_id),
        parseInt(formData.vault_item_id),
        parseInt(formData.recipient_id),
        formData.permission
      );
      setShowCreateModal(false);
      setFormData({ policy_id: '', vault_item_id: '', recipient_id: '', permission: 'view' });
      alert('Assignment created successfully!');
    } catch (err) {
      console.error('Failed to create assignment:', err);
      alert('Failed to create assignment. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const getRecipientName = (recipientId) => {
    const recipient = recipients.find(r => r.id === recipientId);
    return recipient ? recipient.legal_name : 'Unknown';
  };

  const getVaultItemTitle = (itemId) => {
    const item = vaultItems.find(v => v.id === itemId);
    return item ? item.title : 'Unknown';
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
            <p className="text-gray-600">Assign vault items to recipients in your policies</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} disabled={policies.length === 0 || recipients.length === 0 || vaultItems.length === 0}>
            <Plus className="w-5 h-5 inline mr-2" />
            Create Assignment
          </Button>
        </div>

        {policies.length === 0 || recipients.length === 0 || vaultItems.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Link2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Setup Required</h3>
              <p className="text-gray-600 mb-4">
                {policies.length === 0 && 'Create a policy first. '}
                {recipients.length === 0 && 'Add recipients first. '}
                {vaultItems.length === 0 && 'Add vault items first. '}
              </p>
              <div className="flex justify-center space-x-3">
                {policies.length === 0 && (
                  <a href="/policies">
                    <Button variant="outline">Go to Policies</Button>
                  </a>
                )}
                {recipients.length === 0 && (
                  <a href="/recipients">
                    <Button variant="outline">Go to Recipients</Button>
                  </a>
                )}
                {vaultItems.length === 0 && (
                  <a href="/vault-items">
                    <Button variant="outline">Go to Vault Items</Button>
                  </a>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Create Assignment</h2>
              <p className="text-gray-600 text-sm">
                Select a policy, vault item, and recipient to assign access. Each assignment grants a specific recipient access to a specific vault item under a given policy.
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-5 h-5 inline mr-2" />
              Create New Assignment
            </Button>
          </Card>
        )}

        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Assignment"
        >
          <form onSubmit={handleCreateAssignment}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.policy_id}
                  onChange={(e) => setFormData({ ...formData, policy_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select a policy</option>
                  {policies.map((policy) => (
                    <option key={policy.id} value={policy.id}>
                      Policy #{policy.id} ({policy.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vault Item <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.vault_item_id}
                  onChange={(e) => setFormData({ ...formData, vault_item_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select a vault item</option>
                  {vaultItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} ({item.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.recipient_id}
                  onChange={(e) => setFormData({ ...formData, recipient_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select a recipient</option>
                  {recipients.map((recipient) => (
                    <option key={recipient.id} value={recipient.id}>
                      {recipient.legal_name} ({recipient.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permission <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.permission}
                  onChange={(e) => setFormData({ ...formData, permission: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="view">View</option>
                  <option value="export">Export</option>
                </select>
                <p className="mt-2 text-sm text-gray-600">
                  View: Recipient can see the item. Export: Recipient can download/export the item.
                </p>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create Assignment'}
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
