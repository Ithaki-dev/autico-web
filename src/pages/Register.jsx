import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Settings, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const registerSchema = z.object({
  cedula: z
    .string()
    .min(9, 'La cédula debe tener al menos 9 dígitos')
    .max(12, 'La cédula no puede tener más de 12 dígitos')
    .regex(/^\d+$/, 'La cédula solo debe contener números'),
  firstName: z.string().optional(),
  lastName1: z.string().optional(),
  lastName2: z.string().optional(),
  username: z
    .string()
    .min(3, 'El usuario debe tener al menos 3 caracteres')
    .max(20, 'El usuario no puede tener más de 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo se permiten letras, números y guiones bajos'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{10}$/.test(val.replace(/\D/g, '')),
      'El teléfono debe tener 10 dígitos'
    ),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [isValidatingIdentity, setIsValidatingIdentity] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [identityError, setIdentityError] = useState('');
  const [identitySuccess, setIdentitySuccess] = useState('');
  const [identityValidated, setIdentityValidated] = useState(false);
  const [validatedCedula, setValidatedCedula] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      cedula: '',
      firstName: '',
      lastName1: '',
      lastName2: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const cedulaValue = watch('cedula');

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!validatedCedula) {
      return;
    }

    if (cedulaValue !== validatedCedula) {
      setValue('firstName', '');
      setValue('lastName1', '');
      setValue('lastName2', '');
      setIdentityValidated(false);
      setValidatedCedula('');
      setIdentitySuccess('');
      setIdentityError('Debes volver a validar la cédula después de modificarla');
    }
  }, [cedulaValue, setValue, validatedCedula]);

  const handleValidateIdentity = async () => {
    const cedula = (cedulaValue || '').trim();

    if (!cedula) {
      setError('cedula', {
        type: 'manual',
        message: 'Ingresa una cédula para validarla',
      });
      return;
    }

    setIsValidatingIdentity(true);
    setIdentityError('');
    setIdentitySuccess('');

    try {
      const response = await authService.validateIdentity(cedula);

      if (response.valid && response.isAdult) {
        setValue('firstName', response.firstName || '');
        setValue('lastName1', response.lastName1 || '');
        setValue('lastName2', response.lastName2 || '');
        setIdentityValidated(true);
        setValidatedCedula(cedula);
        setIdentitySuccess(response.message || 'Identidad validada correctamente');
        clearErrors('cedula');
        return;
      }

      setValue('firstName', '');
      setValue('lastName1', '');
      setValue('lastName2', '');
      setIdentityValidated(false);
      setValidatedCedula('');
      setIdentityError(response.message || 'No fue posible validar la cédula');
    } catch (error) {
      setValue('firstName', '');
      setValue('lastName1', '');
      setValue('lastName2', '');
      setIdentityValidated(false);
      setValidatedCedula('');
      setIdentityError(error.message || 'No se pudo validar la cédula. Intenta de nuevo');
    } finally {
      setIsValidatingIdentity(false);
    }
  };

  const onSubmit = async (data) => {
    if (!identityValidated || data.cedula !== validatedCedula) {
      setIdentityError('Debes validar una cédula vigente antes de registrarte');
      return;
    }

    setIsRegisterLoading(true);
    try {
      const registerPayload = {
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        cedula: data.cedula,
      };

      await registerUser(registerPayload);
      // El registro fue exitoso, redirigir a login
      navigate('/login');
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setIsRegisterLoading(false);
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
            Crear Cuenta
          </h2>
          <p className="text-gray-300">
            Únete a nuestra plataforma de compra-venta
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-metal-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Cedula */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <Input
                label="Cédula"
                placeholder="123456789"
                error={errors.cedula?.message}
                required
                className="sm:flex-1"
                {...register('cedula')}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                loading={isValidatingIdentity}
                disabled={isValidatingIdentity || isRegisterLoading}
                onClick={handleValidateIdentity}
              >
                Validar cédula
              </Button>
            </div>

            {identityError && (
              <p className="text-sm font-medium text-red-600">{identityError}</p>
            )}
            {identitySuccess && (
              <p className="text-sm font-medium text-emerald-600">{identitySuccess}</p>
            )}

            {/* Identity Names (read-only) */}
            <Input
              label="Nombre"
              placeholder="Se completará al validar"
              readOnly
              {...register('firstName')}
            />

            <Input
              label="Primer Apellido"
              placeholder="Se completará al validar"
              readOnly
              {...register('lastName1')}
            />

            <Input
              label="Segundo Apellido"
              placeholder="Se completará al validar"
              readOnly
              {...register('lastName2')}
            />

            {/* Username */}
            <Input
              label="Nombre de Usuario"
              placeholder="tu-usuario"
              error={errors.username?.message}
              required
              {...register('username')}
            />

            {/* Email */}
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              required
              {...register('email')}
            />

            {/* Phone */}
            <Input
              label="Teléfono"
              type="tel"
              placeholder="5512345678"
              error={errors.phone?.message}
              {...register('phone')}
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

            {/* Confirm Password */}
            <Input
              label="Confirmar Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              required
              {...register('confirmPassword')}
            />

            {/* Terms */}
            <div className="text-sm text-dark-600">
              Al registrarte, aceptas nuestros{' '}
              <Link to="/terms" className="text-primary-600 font-semibold hover:underline">
                Términos y Condiciones
              </Link>{' '}
              y{' '}
              <Link to="/privacy" className="text-primary-600 font-semibold hover:underline">
                Política de Privacidad
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              loading={isRegisterLoading}
              disabled={!identityValidated || isRegisterLoading || isValidatingIdentity}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Registrarse
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-dark-500 font-medium">
                ¿Ya tienes cuenta?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link to="/login">
            <Button variant="outline" className="w-full">
              Iniciar Sesión
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

export default Register;
