import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { recipientsAPI } from '../services/api';
import { Plus, Users, Mail, Calendar, User } from 'lucide-react';

export default function RecipientManagement() {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    legal_name: '',
    dob: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    try {
      const data = await recipientsAPI.list();
      setRecipients(data);
    } catch (err) {
      console.error('Failed to load recipients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecipient = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await recipientsAPI.create(formData.email, formData.legal_name, formData.dob);
      await loadRecipients();
      setShowCreateModal(false);
      setFormData({ email: '', legal_name: '', dob: '' });
    } catch (err) {
      console.error('Failed to create recipient:', err);
      alert('Failed to create recipient. Please try again.');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recipients</h1>
            <p className="text-gray-600">Manage beneficiaries who will receive access to your accounts</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-5 h-5 inline mr-2" />
            Add Recipient
          </Button>
        </div>

        {recipients.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recipients yet</h3>
              <p className="text-gray-600 mb-4">Add beneficiaries to receive access to your accounts</p>
              <Button onClick={() => setShowCreateModal(true)}>Add Recipient</Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipients.map((recipient) => (
              <Card key={recipient.id}>
                <div className="flex items-start space-x-3 mb-4">
                  <div className="bg-primary-100 rounded-full p-3">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{recipient.legal_name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Added {new Date(recipient.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{recipient.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">DOB: {recipient.dob}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Add Recipient"
        >
          <form onSubmit={handleCreateRecipient}>
            <div className="space-y-4">
              <Input
                label="Legal Name"
                type="text"
                value={formData.legal_name}
                onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                placeholder="John Doe"
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
              <Input
                label="Date of Birth (YYYY-MM-DD)"
                type="text"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                placeholder="1990-01-15"
                required
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <Button type="submit" disabled={creating}>
                {creating ? 'Adding...' : 'Add Recipient'}
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
