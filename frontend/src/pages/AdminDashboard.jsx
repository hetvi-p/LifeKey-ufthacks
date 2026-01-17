import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Shield, CheckCircle, Clock, X, Send } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { claimsAPI } from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [claimData, setClaimData] = useState(null);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [actioning, setActioning] = useState(false);

  // For demo purposes, we'll need to implement a way to list claims
  // Since there's no GET /claims endpoint, we'll simulate it
  useEffect(() => {
    // In production, you'd fetch claims from an admin endpoint
    // For now, we'll show a message that claims need to be accessed by ID
    setLoading(false);
  }, []);

  const handleLoadClaim = async () => {
    if (!selectedClaim) return;
    
    setLoadingClaim(true);
    setClaimData(null);
    try {
      const data = await claimsAPI.get(parseInt(selectedClaim));
      setClaimData(data);
    } catch (err) {
      console.error('Failed to load claim:', err);
      alert(err.response?.data?.detail || 'Failed to load claim. Please check the claim ID.');
      setClaimData(null);
    } finally {
      setLoadingClaim(false);
    }
  };

  const handleApproveClaim = async (claimId) => {
    if (!confirm('Are you sure you want to approve this claim? This will grant access to the recipient.')) {
      return;
    }

    setActioning(true);
    try {
      const updatedClaim = await claimsAPI.approve(claimId);
      setClaimData(updatedClaim); // Update the claim data with new status
      alert('Claim approved successfully!');
    } catch (err) {
      console.error('Failed to approve claim:', err);
      alert('Failed to approve claim. Please try again.');
    } finally {
      setActioning(false);
    }
  };

  const handleIssueReleases = async (claimId) => {
    if (!confirm('Issue release links for all recipients in this claim?')) {
      return;
    }

    setActioning(true);
    try {
      const releases = await claimsAPI.issueReleases(claimId);
      alert(`Releases issued successfully! ${releases.length} release link(s) generated.`);
      // Show release URLs
      const releaseUrls = releases.map(r => r.release_url).join('\n');
      console.log('Release URLs:', releaseUrls);
    } catch (err) {
      console.error('Failed to issue releases:', err);
      alert('Failed to issue releases. Please try again.');
    } finally {
      setActioning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="max-w-7xl mx-auto pt-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="w-8 h-8 text-primary-600" />
              <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <p className="text-gray-600">Review and approve claims</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/login')}>
            Logout
          </Button>
        </div>

        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Claim Review</h2>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> To review a specific claim, use the claim ID. 
              Claims can be approved after verification of identity and documents.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Review Claim by ID</h3>
              <div className="flex space-x-3">
                <input
                  type="number"
                  placeholder="Enter Claim ID"
                  value={selectedClaim || ''}
                  onChange={(e) => setSelectedClaim(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <Button onClick={handleLoadClaim} disabled={!selectedClaim || loadingClaim}>
                  {loadingClaim ? 'Loading...' : 'Load Claim'}
                </Button>
              </div>
            </div>

            {loadingClaim && (
              <div className="border border-gray-200 rounded-lg p-6 bg-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading claim details...</p>
              </div>
            )}

            {claimData && (
              <div className="border border-gray-200 rounded-lg p-6 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim #{claimData.id}</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Policy ID:</span>
                      <span className="ml-2 font-medium text-gray-900">{claimData.policy_id}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Recipient ID:</span>
                      <span className="ml-2 font-medium text-gray-900">{claimData.submitted_by_recipient_id}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {new Date(claimData.created_at).toLocaleString()}
                      </span>
                    </div>
                    {claimData.reviewed_at && (
                      <div>
                        <span className="text-gray-600">Reviewed:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {new Date(claimData.reviewed_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {claimData.reviewed_by && (
                      <div>
                        <span className="text-gray-600">Reviewed By:</span>
                        <span className="ml-2 font-medium text-gray-900">{claimData.reviewed_by}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm pt-2 border-t border-gray-200">
                    {claimData.status === 'pending' ? (
                      <Clock className="w-4 h-4 text-yellow-600" />
                    ) : claimData.status === 'approved' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      claimData.status === 'pending' ? 'text-yellow-600' :
                      claimData.status === 'approved' ? 'text-green-600' :
                      'text-red-600'
                    }`}>
                      Status: {claimData.status.charAt(0).toUpperCase() + claimData.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    {claimData.status === 'pending' && (
                      <Button
                        onClick={() => handleApproveClaim(parseInt(selectedClaim))}
                        disabled={actioning}
                      >
                        <CheckCircle className="w-5 h-5 inline mr-2" />
                        Approve Claim
                      </Button>
                    )}
                    {claimData.status === 'approved' && (
                      <Button
                        onClick={() => handleIssueReleases(parseInt(selectedClaim))}
                        variant="outline"
                        disabled={actioning}
                      >
                        <Send className="w-5 h-5 inline mr-2" />
                        Issue Releases
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Approve Claims</h3>
              <p className="text-sm text-gray-600 mb-3">
                Review submitted claims and approve access for verified recipients.
              </p>
              <p className="text-xs text-gray-500">
                Use claim ID to review specific claims. Verify identity documents and death certificates before approval.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Issue Releases</h3>
              <p className="text-sm text-gray-600 mb-3">
                Generate time-limited release links for approved claims.
              </p>
              <p className="text-xs text-gray-500">
                After approval, issue releases to allow recipients to access their assigned items. 
                Release links expire after 6 hours.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
