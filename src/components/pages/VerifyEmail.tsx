import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function VerifyEmail() {
  const navigate = useNavigate();
  const { verifyEmail, user, fetchUserStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Ensure user is logged in
  useEffect(() => {
    if (!user) {
      toast.error('No user found. Please sign in again.');
      navigate('/login');
    } else {
      checkVerificationStatus();
    }
  }, [user, navigate]);

  // Function to check if email is already verified
  const checkVerificationStatus = async () => {
    setIsCheckingStatus(true);
    if (!user?.id) return; // Safeguard against null user
    try {
      const status = await fetchUserStatus(user.id);
      setIsVerified(status.isEmailVerified);
      if (status.isEmailVerified) {
        toast.success('Your email is already verified.');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('If verified, you can now login.');
      console.error(error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Handle when user clicks "I Have Verified" button
  const handleVerifyClick = async () => {
    setLoading(true);
    try {
      const result = await verifyEmail();
      if (result.success) {
        const status = await fetchUserStatus(user?.id || '');
        if (status.isEmailVerified) {
          setIsVerified(true);
          toast.success('Email verified successfully!');
          navigate('/login');
        } else {
          toast.error('If verified, you can now login.');
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    } catch (error) {
      toast.error('The Email is not Verified. Please check your email and click the verification link.');
      navigate('/login');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
          <p className="mt-2 text-gray-600">
            A verification link has been sent to your email!
          </p>
          <p className="mt-2 text-red-600">
            <strong>Note:</strong> Clicking on the link will verify your email, even if it redirects you to a blank page.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {isCheckingStatus ? (
            <button
              disabled
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Redirecting...
            </button>
          ) : (
            <button
              onClick={handleVerifyClick}
              disabled={loading || isVerified}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Checking...' : isVerified ? 'Redirecting...' : 'I Have Verified'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
