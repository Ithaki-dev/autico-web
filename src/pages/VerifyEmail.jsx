import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, CheckCircle2, AlertTriangle } from 'lucide-react';
import { authService } from '../api/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

const REDIRECT_DELAY_MS = 2500;

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasVerifiedRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (hasVerifiedRef.current) {
      return;
    }

    hasVerifiedRef.current = true;

    let redirectTimeout;

    const verify = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setErrorMessage('No encontramos el token de verificación. Revisa el enlace o solicita uno nuevo.');
        setLoading(false);
        return;
      }

      try {
        const data = await authService.verifyEmail(token);

        setSuccess(true);
        setSuccessMessage(data?.message || 'Tu cuenta fue verificada correctamente.');
        setErrorMessage('');

        redirectTimeout = window.setTimeout(() => {
          navigate('/login', { replace: true });
        }, REDIRECT_DELAY_MS);
      } catch (error) {
        setSuccess(false);
        setSuccessMessage('');
        setErrorMessage(error?.message || 'No pudimos verificar tu correo. Es posible que el enlace haya expirado.');
      } finally {
        setLoading(false);
      }
    };

    verify();

    return () => {
      if (redirectTimeout) {
        window.clearTimeout(redirectTimeout);
      }
    };
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-warning-400 to-secondary-500 rounded-lg flex items-center justify-center">
              <Settings className="w-7 h-7 text-white animate-spin-slow" />
            </div>
            <span className="text-3xl font-display font-black text-white">
              AUTO<span className="text-warning-400">TICO</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-metal-xl p-8">
          {loading ? (
            <LoadingSpinner text="Verificando tu correo..." />
          ) : success ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-display font-black text-dark-900">Correo verificado</h1>
              <p className="text-dark-600">{successMessage}</p>
              <p className="text-dark-600">Te redirigiremos al login en unos segundos.</p>
              <p className="text-sm text-dark-500">Si no pasa automáticamente, usa el botón de abajo.</p>
              <Button variant="primary" className="w-full" onClick={() => navigate('/login', { replace: true })}>
                Ir a login
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-display font-black text-dark-900">No pudimos verificar tu correo</h1>
              <p className="text-red-600 font-medium">{errorMessage}</p>
              <Button variant="primary" className="w-full" onClick={() => navigate('/login', { replace: true })}>
                Ir a login
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
