import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, CheckCircle } from 'lucide-react';
import RecipientLayout from '../components/RecipientLayout';
import Card from '../components/Card';
import Button from '../components/Button';

export default function VerificationPage() {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Failed to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPhotoData(dataUrl);
      setPhotoTaken(true);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setPhotoTaken(false);
    setPhotoData(null);
    startCamera();
  };

  const handleSubmit = async () => {
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setSubmitting(true);
    // In a real app, you would upload the photo to the backend for AI verification
    // For now, we'll just simulate success
    setTimeout(() => {
      setSubmitting(false);
      alert('Verification submitted! Your claim is being reviewed.');
      navigate('/claim');
    }, 2000);
  };

  return (
    <RecipientLayout
      title="Identity Verification"
      subtitle="Verify your identity with a live photo"
    >
      <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Step 1: Live Photo Capture</h2>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Please position your face in the center of the frame. Ensure good lighting and remove any hats or sunglasses.
              The photo will be used to verify your identity against your ID document.
            </p>

            {!photoTaken ? (
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <Button
                    onClick={capturePhoto}
                    className="bg-white text-gray-900 hover:bg-gray-100"
                  >
                    <Camera className="w-5 h-5 inline mr-2" />
                    Capture Photo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <img src={photoData} alt="Captured" className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3">
                  <Button
                    onClick={retakePhoto}
                    variant="secondary"
                    className="bg-white text-gray-900 hover:bg-gray-100"
                  >
                    Retake
                  </Button>
                </div>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Step 2: Legal Agreement</h2>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto text-sm text-gray-700">
              <h3 className="font-semibold mb-2">Terms and Conditions</h3>
              <p className="mb-2">
                By proceeding, you agree to the following terms:
              </p>
              <ul className="list-disc list-inside space-y-1 mb-2">
                <li>You are the legitimate beneficiary or executor listed in the digital will</li>
                <li>All provided documents are authentic and accurate</li>
                <li>You will only use the accessed information for lawful purposes</li>
                <li>You understand that false claims may result in legal action</li>
                <li>All activities are logged and auditable</li>
              </ul>
              <p className="text-xs text-gray-600">
                This verification process uses AI-powered identity matching. Your photo will be compared against 
                your uploaded ID document to ensure authenticity.
              </p>
            </div>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">
                I agree to the terms and conditions and confirm that all information provided is accurate and authentic.
              </span>
            </label>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full mt-6"
            disabled={!photoTaken || !agreeToTerms || submitting}
          >
            {submitting ? 'Submitting...' : (
              <>
                <CheckCircle className="w-5 h-5 inline mr-2" />
                Submit Verification
              </>
            )}
          </Button>
        </Card>
    </RecipientLayout>
  );
}
