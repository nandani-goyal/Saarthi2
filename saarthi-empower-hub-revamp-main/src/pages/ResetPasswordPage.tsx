import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import SaarthiLogo from '../components/SaarthiLogo';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    if (!token) {
      // No token → redirect to home
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  const handleClose = () => {
    setIsModalOpen(false);
    navigate('/', { replace: true });
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      {/* Background branding */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <SaarthiLogo size="lg" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Saarthi</h1>
        <p className="text-muted-foreground mt-2">Empowering Women's Health</p>
      </div>

      {/* The reset password modal is shown automatically */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={handleClose}
        defaultMode="resetPassword"
        resetToken={token}
      />
    </div>
  );
};

export default ResetPasswordPage;
