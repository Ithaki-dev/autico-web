import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../api/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const verify2FASchema = z.object({
  code: z
    .string()
    .min(6, 'El código debe tener 6 dígitos')
    .max(6, 'El código debe tener 6 dígitos')
    .regex(/^\d{6}$/, 'Ingresa un código numérico válido'),
});

const Verify2FA = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verify2FA } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verify2FASchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data) => {
    const tempToken = location.state?.tempToken || authService.get2FATempToken();

    if (!tempToken) {
      setError('Tu sesión de verificación expiró. Inicia sesión nuevamente.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await verify2FA({
        code: data.code,
        tempToken,
      });

      if (!response.success || !response.token) {
        throw new Error(response.message || 'No se pudo completar la verificación 2FA.');
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Código inválido o expirado. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
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
          <h2 className="text-3xl font-display font-black text-white mb-2">
            Verificación 2FA
          </h2>
          <p className="text-gray-300">
            Ingresa el código de 6 dígitos de tu app autenticadora
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-metal-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Código de verificación"
              placeholder="123456"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              error={errors.code?.message}
              required
              disabled={isLoading}
              {...register('code')}
            />

            {error && <p className="text-sm font-medium text-red-600">{error}</p>}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              loading={isLoading}
              disabled={isLoading}
            >
              <ShieldCheck className="w-5 h-5 mr-2" />
              Verificar código
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                authService.clear2FATempToken();
                navigate('/login', { replace: true });
              }}
              disabled={isLoading}
            >
              Volver al login
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Verify2FA;
