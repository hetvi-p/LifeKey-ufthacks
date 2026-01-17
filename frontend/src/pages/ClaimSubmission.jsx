import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimsAPI } from '../services/api';
import { Upload, FileText } from 'lucide-react';
import RecipientLayout from '../components/RecipientLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

export default function ClaimSubmission() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    policy_id: '',
    recipient_email: '',
    legal_name: '',
    dob: '',
  });
  const [idDoc, setIdDoc] = useState(null);
  const [deathCert, setDeathCert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!idDoc || !deathCert) {
      setError('Please upload both ID document and death certificate');
      return;
    }

    setSubmitting(true);
    try {
      const claim = await claimsAPI.submit(
        parseInt(formData.policy_id),
        formData.recipient_email,
        formData.legal_name,
        formData.dob,
        idDoc,
        deathCert
      );
      navigate(`/verify/${claim.id}`);
    } catch (err) {
      console.error('Failed to submit claim:', err);
      
      // DEV MODE: If backend is not running, allow UI navigation with mock claim
      if (!err.response || err.response.status === 500 || err.code === 'ECONNREFUSED') {
        // Backend not running - use mock claim ID for UI development
        console.log('DEV MODE: Backend not available, using mock claim for UI preview');
        navigate('/verify/1');
        return;
      }
      
      setError(err.response?.data?.detail || 'Failed to submit claim. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RecipientLayout
      title="Submit Claim"
      subtitle="Request access to the accounts and credentials assigned to you"
    >
      <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Claim Information</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Policy ID"
              type="number"
              value={formData.policy_id}
              onChange={(e) => setFormData({ ...formData, policy_id: e.target.value })}
              placeholder="Enter policy ID"
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.recipient_email}
              onChange={(e) => setFormData({ ...formData, recipient_email: e.target.value })}
              placeholder="your@email.com"
              required
            />

            <Input
              label="Legal Name"
              type="text"
              value={formData.legal_name}
              onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
              placeholder="John Doe"
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

            {/* File Uploads */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Document (Driver's License / Passport) <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="id-doc" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                      <span>Upload a file</span>
                      <input
                        id="id-doc"
                        name="id-doc"
                        type="file"
                        className="sr-only"
                        accept="image/*,.pdf"
                        onChange={(e) => setIdDoc(e.target.files[0])}
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  {idDoc && (
                    <p className="text-sm text-gray-900 mt-2">{idDoc.name}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Death Certificate <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
                <div className="space-y-1 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="death-cert" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                      <span>Upload a file</span>
                      <input
                        id="death-cert"
                        name="death-cert"
                        type="file"
                        className="sr-only"
                        accept="image/*,.pdf"
                        onChange={(e) => setDeathCert(e.target.files[0])}
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  {deathCert && (
                    <p className="text-sm text-gray-900 mt-2">{deathCert.name}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> After submitting this claim, you will be asked to verify your identity with a live photo. 
                This claim will be reviewed by an administrator before access is granted.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </Button>
          </form>
        </Card>
    </RecipientLayout>
  );
}
