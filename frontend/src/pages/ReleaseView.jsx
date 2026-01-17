import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { releasesAPI } from '../services/api';
import { Lock, Wallet, FileText, Key, CheckCircle } from 'lucide-react';
import RecipientLayout from '../components/RecipientLayout';
import Card from '../components/Card';

export default function ReleaseView() {
  const { token } = useParams();
  const [releaseData, setReleaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRelease();
  }, [token]);

  const loadRelease = async () => {
    try {
      const data = await releasesAPI.view(token);
      setReleaseData(data);
    } catch (err) {
      console.error('Failed to load release:', err);
      setError(err.response?.data?.detail || 'Failed to load release. The link may be expired or invalid.');
    } finally {
      setLoading(false);
    }
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'crypto_wallet':
        return <Wallet className="w-5 h-5 text-yellow-600" />;
      case 'secure_note':
        return <FileText className="w-5 h-5 text-blue-600" />;
      default:
        return <Lock className="w-5 h-5 text-green-600" />;
    }
  };

  const getItemLabel = (type) => {
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
      <RecipientLayout>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your released items...</p>
        </div>
      </RecipientLayout>
    );
  }

  if (error) {
    return (
      <RecipientLayout>
        <Card className="max-w-md mx-auto">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">{error}</p>
          </div>
        </Card>
      </RecipientLayout>
    );
  }

  if (!releaseData) {
    return null;
  }

  return (
    <RecipientLayout
      title="Released Items"
      subtitle={`Items assigned to ${releaseData.recipient_email}`}
    >

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Access Granted</h3>
              <p className="text-sm text-green-800">
                These items have been decrypted and are now available to you. 
                All items were encrypted with zero-knowledge encryption and decrypted securely.
              </p>
            </div>
          </div>
        </div>

        {releaseData.items.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Items Released</h3>
              <p className="text-gray-600">No items were assigned to you in this release.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {releaseData.items.map((item, index) => (
              <Card key={index}>
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 rounded-lg p-3">
                    {getItemIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                        {getItemLabel(item.type)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Decrypted Payload:</h4>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                        {Object.entries(item.payload).map(([key, value]) => (
                          <div key={key} className="flex items-start space-x-2">
                            <span className="text-sm font-medium text-gray-700 min-w-[120px] capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <span className="text-sm text-gray-900 break-all">
                              {typeof value === 'string' ? value : JSON.stringify(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Key className="w-4 h-4" />
                        <span>Permission: {item.permission}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-6 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Security Information</h3>
              <p className="text-sm text-blue-800">
                All items were decrypted using zero-knowledge encryption. Your passwords were never stored 
                in plaintext and were decrypted only on your device. This access is time-limited and 
                all actions are logged in an immutable audit trail.
              </p>
            </div>
          </div>
        </Card>
    </RecipientLayout>
  );
}
