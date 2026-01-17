import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { vaultItemsAPI } from '../services/api';
import { Plus, Lock, Wallet, FileText, Key } from 'lucide-react';

export default function VaultItemManagement() {
  const [vaultItems, setVaultItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'login',
    payload: {},
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadVaultItems();
  }, []);

  const loadVaultItems = async () => {
    try {
      const data = await vaultItemsAPI.list();
      setVaultItems(data);
    } catch (err) {
      console.error('Failed to load vault items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      let payload = {};
      
      // Build payload based on type
      if (formData.type === 'login') {
        payload = {
          username: formData.username || '',
          password: formData.password || '',
          url: formData.url || '',
          notes: formData.notes || '',
        };
      } else if (formData.type === 'crypto_wallet') {
        payload = {
          wallet_address: formData.wallet_address || '',
          seed_phrase: formData.seed_phrase || '',
          network: formData.network || '',
          notes: formData.notes || '',
        };
      } else if (formData.type === 'secure_note') {
        payload = {
          content: formData.content || '',
        };
      }

      await vaultItemsAPI.create(formData.title, formData.type, payload);
      await loadVaultItems();
      setShowCreateModal(false);
      setFormData({ title: '', type: 'login', payload: {} });
    } catch (err) {
      console.error('Failed to create vault item:', err);
      alert('Failed to create vault item. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'crypto_wallet':
        return <Wallet className="w-5 h-5" />;
      case 'secure_note':
        return <FileText className="w-5 h-5" />;
      default:
        return <Lock className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'crypto_wallet':
        return 'Crypto Wallet';
      case 'secure_note':
        return 'Secure Note';
      default:
        return 'Login';
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vault Items</h1>
            <p className="text-gray-600">Manage your encrypted accounts and credentials</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-5 h-5 inline mr-2" />
            Add Vault Item
          </Button>
        </div>

        {vaultItems.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vault items yet</h3>
              <p className="text-gray-600 mb-4">Add accounts, passwords, and credentials to delegate</p>
              <Button onClick={() => setShowCreateModal(true)}>Add Vault Item</Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaultItems.map((item) => (
              <Card key={item.id}>
                <div className="flex items-start space-x-3 mb-4">
                  <div className="bg-primary-100 rounded-full p-3">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {getTypeLabel(item.type)}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Created {new Date(item.created_at).toLocaleDateString()}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Key className="w-3 h-3" />
                    <span>Encrypted and stored securely</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Add Vault Item"
        >
          <form onSubmit={handleCreateItem}>
            <div className="space-y-4">
              <Input
                label="Title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Gmail Account, Bitcoin Wallet"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="login">Login (Username/Password)</option>
                  <option value="crypto_wallet">Crypto Wallet</option>
                  <option value="secure_note">Secure Note</option>
                </select>
              </div>

              {formData.type === 'login' && (
                <>
                  <Input
                    label="Username"
                    type="text"
                    value={formData.username || ''}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="username@example.com"
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                  />
                  <Input
                    label="URL"
                    type="url"
                    value={formData.url || ''}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows="3"
                    />
                  </div>
                </>
              )}

              {formData.type === 'crypto_wallet' && (
                <>
                  <Input
                    label="Wallet Address"
                    type="text"
                    value={formData.wallet_address || ''}
                    onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
                    placeholder="0x..."
                  />
                  <Input
                    label="Network"
                    type="text"
                    value={formData.network || ''}
                    onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                    placeholder="Ethereum, Bitcoin, etc."
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seed Phrase</label>
                    <textarea
                      value={formData.seed_phrase || ''}
                      onChange={(e) => setFormData({ ...formData, seed_phrase: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows="3"
                      placeholder="word1 word2 word3 ..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows="3"
                    />
                  </div>
                </>
              )}

              {formData.type === 'secure_note' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows="6"
                    placeholder="Enter your secure note content..."
                  />
                </div>
              )}
            </div>
            <div className="flex space-x-3 mt-6">
              <Button type="submit" disabled={creating}>
                {creating ? 'Adding...' : 'Add Vault Item'}
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
