import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Settings, CheckCircle2 } from 'lucide-react';
import { authService } from '../api/authService';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const cedulaSchema = z.object({
  cedula: z
    .string()
    .min(1, 'La cédula es obligatoria')
    .transform((value) => value.replace(/[\s-]/g, ''))
    .refine((value) => /^\d{9,12}$/.test(value), 'La cédula debe tener entre 9 y 12 dígitos numéricos'),
});

const GoogleAuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const hasProcessedCallback = useRef(false);

  const [loading, setLoading] = useState(true);
  const [requiresCedula, setRequiresCedula] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [isSubmittingCedula, setIsSubmittingCedula] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cedulaSchema),
    defaultValues: {
      cedula: '',
    },
  });

  useEffect(() => {
    if (hasProcessedCallback.current) {
      return;
    }

    hasProcessedCallback.current = true;

    const processGoogleCallback = async () => {
      setLoading(true);
      setRequiresCedula(false);
      setError('');

      try {
        const result = authService.parseGoogleAuthResult(location.search);

        if (result.success === false) {
          throw new Error(result.error || 'No se pudo autenticar con Google. Intenta nuevamente.');
        }

        if (result.requiresCedula) {
          const callbackTempToken = result.tempToken || authService.getGoogleTempToken();

          if (!callbackTempToken) {
            throw new Error('No se recibió token temporal para completar el registro. Inicia con Google de nuevo.');
          }

          authService.setGoogleTempToken(callbackTempToken);
          setTempToken(callbackTempToken);
          setRequiresCedula(true);
          return;
        }

        if (result.success === true && result.doesNotRequireCedula && result.token) {
          let user = result.user;

          if (!user) {
            user = authService.getUserFromToken(result.token);
          }

          if (!user) {
            user = {
              username: 'Usuario',
            };
          }

          loginWithToken(result.token, user, '¡Sesión con Google iniciada!');
          navigate('/dashboard', { replace: true });
          return;
        }

        throw new Error('Respuesta de callback inválida o incompleta.');
      } catch (err) {
        setError(err.message || 'Ocurrió un problema procesando el inicio con Google.');
      } finally {
        setLoading(false);
      }
    };

    processGoogleCallback();
  }, [location.search, loginWithToken, navigate]);

  const onSubmitCedula = async (data) => {
    const tokenToUse = tempToken || authService.getGoogleTempToken();

    if (!tokenToUse) {
      setError('Tu sesión temporal expiró. Inicia sesión con Google nuevamente.');
      return;
    }

    setIsSubmittingCedula(true);
    setError('');

    try {
      const result = await authService.completeGoogleRegistration(
        data.cedula,
        tokenToUse
      );

      if (!result.token || !result.user) {
        throw new Error('El backend no devolvió token y usuario final.');
      }

      loginWithToken(result.token, result.user, '¡Registro con Google completado!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'No se pudo completar el registro con cédula.');
    } finally {
      setIsSubmittingCedula(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
            <LoadingSpinner text="Procesando autenticación con Google..." />
          ) : requiresCedula ? (
            <form onSubmit={handleSubmit(onSubmitCedula)} className="space-y-5">
              <h2 className="text-2xl font-display font-black text-dark-900 text-center">
                Completar Registro
              </h2>

              <p className="text-sm text-dark-600 text-center">
                Tu cuenta de Google está validada. Solo falta ingresar tu cédula.
              </p>

              <Input
                label="Cédula"
                placeholder="1-2345-6789"
                error={errors.cedula?.message}
                required
                disabled={isSubmittingCedula}
                {...register('cedula')}
              />

              <p className="text-xs text-dark-500 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Puedes escribirla con o sin guiones; la normalizamos automáticamente.
              </p>

              {error && <p className="text-sm font-medium text-red-600">{error}</p>}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                size="lg"
                loading={isSubmittingCedula}
                disabled={isSubmittingCedula}
              >
                Completar registro
              </Button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-display font-black text-dark-900">
                No fue posible continuar
              </h2>
              <p className="text-red-600 font-medium">{error}</p>
              <div className="flex flex-col gap-3 pt-2">
                <Button variant="primary" className="w-full" onClick={() => navigate('/login', { replace: true })}>
                  Volver a iniciar sesión
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/register', { replace: true })}>
                  Ir a registro
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default GoogleAuthSuccess;
