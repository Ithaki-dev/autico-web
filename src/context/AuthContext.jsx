import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

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
      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión');
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
      if (response.success && response.data.user) {
        setUser(response.data.user);
        toast.success(`¡Bienvenido, ${response.data.user.username}!`);
      }
      return response;
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
      throw error;
    }
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
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
