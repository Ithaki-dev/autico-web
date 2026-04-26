import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Settings, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../api/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import GoogleAuthButton from '../components/common/GoogleAuthButton';

const loginSchema = z.object({
  username: z.string().min(1, 'Usuario o email es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await login(data);
      const requires2FA =
        response?.requires2FA ||
        response?.data?.requires2FA ||
        response?.data?.data?.requires2FA;
      const tempToken =
        response?.tempToken ||
        response?.data?.tempToken ||
        response?.data?.data?.tempToken;

      if (requires2FA) {
        if (!tempToken) {
          throw new Error('No se recibió token temporal para completar 2FA.');
        }

        authService.set2FATempToken(tempToken);
        navigate('/verify-2fa', {
          replace: true,
          state: {
            from,
            tempToken,
          },
        });
        return;
      }

      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    authService.startGoogleLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Header */}
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
            Iniciar Sesión
          </h2>
          <p className="text-gray-300">
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-metal-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username/Email */}
            <Input
              label="Usuario o Email"
              placeholder="tu-usuario o tu@email.com"
              error={errors.username?.message}
              required
              {...register('username')}
            />

            {/* Password */}
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              required
              {...register('password')}
            />

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              loading={isLoading}
              disabled={isLoading}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Iniciar Sesión
            </Button>

            <GoogleAuthButton
              onClick={handleGoogleLogin}
              disabled={isLoading}
              text="Continuar con Google"
            />
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-dark-500 font-medium">
                ¿No tienes cuenta?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link to="/register">
            <Button variant="outline" className="w-full">
              Crear una cuenta
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
