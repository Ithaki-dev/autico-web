import { useState, useEffect } from 'react';
import { authService } from '../api/authService';
import toast from 'react-hot-toast';
import { AuthContext } from './authContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al iniciar
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  // Registro
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      toast.success('¡Registro exitoso! Revisa tu correo para verificar tu cuenta antes de iniciar sesión');
      return response;
    } catch (error) {
      toast.error(error.message || 'Error al registrar usuario');
      throw error;
    }
  };

  // Login
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const authUser = response?.data?.user || response?.data?.data?.user;

      if (response.success && authUser) {
        setUser(authService.getCurrentUser() || authUser);
        toast.success(`¡Bienvenido, ${authUser.username}!`);
      }
      return response;
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
      throw error;
    }
  };

  // Verificar código 2FA
  const verify2FA = async (payload) => {
    try {
      const response = await authService.verify2FA(payload);
      const authUser = response?.user || response?.data?.user || authService.getCurrentUser();

      if (response.success && authUser) {
        setUser(authUser);
        toast.success(`¡Bienvenido, ${authUser.username || 'Usuario'}!`);
      }

      return response;
    } catch (error) {
      toast.error(error.message || 'Código de verificación inválido');
      throw error;
    }
  };

  // Login con token y usuario (flujo OAuth y restauración)
  const loginWithToken = (token, userData, successMessage = 'Sesión iniciada correctamente') => {
    authService.saveSession(token, userData);
    setUser(authService.getCurrentUser() || userData);
    authService.clearGoogleTempToken();
    toast.success(successMessage);
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Sesión cerrada correctamente');
  };

  // Verificar si está autenticado
  const isAuthenticated = () => {
    return !!user && authService.isAuthenticated();
  };

  const value = {
    user,
    loading,
    register,
    login,
    verify2FA,
    loginWithToken,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
