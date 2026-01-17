import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { auditAPI } from '../services/api';
import { History, User, FileText, Lock, Users, Link2, CheckCircle, Eye } from 'lucide-react';

export default function AuditLog() {
  const [auditEvents, setAuditEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditLog();
  }, []);

  const loadAuditLog = async () => {
    try {
      const data = await auditAPI.list();
      setAuditEvents(data || []);
    } catch (err) {
      console.error('Failed to load audit log:', err);
      // If endpoint doesn't exist yet, show empty state
      setAuditEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'POLICY_CREATED':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'RECIPIENT_ADDED':
        return <Users className="w-5 h-5 text-green-600" />;
      case 'VAULT_ITEM_CREATED':
        return <Lock className="w-5 h-5 text-purple-600" />;
      case 'ASSIGNMENT_CREATED':
        return <Link2 className="w-5 h-5 text-orange-600" />;
      case 'CLAIM_SUBMITTED':
        return <FileText className="w-5 h-5 text-yellow-600" />;
      case 'CLAIM_APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'RELEASE_ISSUED':
        return <Link2 className="w-5 h-5 text-blue-600" />;
      case 'RELEASE_VIEWED':
        return <Eye className="w-5 h-5 text-indigo-600" />;
      default:
        return <History className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActionLabel = (action) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Log</h1>
          <p className="text-gray-600">Immutable timeline of all actions in your digital will</p>
        </div>

        {auditEvents.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No audit events yet</h3>
              <p className="text-gray-600">
                Audit events will appear here as you create policies, add recipients, assign items, and manage claims.
              </p>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="space-y-4">
              {auditEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg ${
                    index !== auditEvents.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div className="mt-0.5">
                    {getActionIcon(event.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {getActionLabel(event.action)}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(event.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{event.actor}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>Target:</span>
                        <span className="font-medium">{event.target_type} #{event.target_id}</span>
                      </span>
                    </div>
                    {event.metadata_json && event.metadata_json !== '{}' && (
                      <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(JSON.parse(event.metadata_json), null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="mt-6 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <History className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">About Audit Logs</h3>
              <p className="text-sm text-blue-800">
                All actions in your digital will are recorded in an immutable audit trail. 
                This provides transparency and accountability, ensuring that all activities can be 
                reviewed and verified. Audit logs cannot be modified or deleted.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
