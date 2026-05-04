import { useQuery } from '@apollo/client';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { GET_ME, GET_USER_BY_ID, GET_USER_BY_USERNAME } from '../graphql/queries/user';

/**
 * Hook para obtener los datos del usuario actual
 * Requiere autenticación (token en localStorage)
 */
export const useAuth = () => {
  // Preferir el contexto AuthProvider si existe (mantiene compatibilidad con el código antiguo)
  const ctx = useContext(AuthContext);
  if (ctx) return ctx;

  // Fallback: consulta GET_ME desde Apollo y expone la misma API mínima
  const { data, loading, error, refetch } = useQuery(GET_ME, {
    fetchPolicy: 'cache-first', // Usa cache, pero valida con el servidor
    errorPolicy: 'all', // Permite error partial
    skip: !localStorage.getItem('auth_token'), // No ejecuta si no hay token
  });

  const user = data?.me || null;
  const isAuthenticated = () => !!user;
  const isLoading = loading;
  const errorMessage = error?.message || null;

  const logout = () => {
    try {
      localStorage.removeItem('auth_token');
    } catch (e) {
      // noop
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error: errorMessage,
    refetch,
    logout,
  };
};

/**
 * Hook para obtener usuario por ID
 */
export const useUserById = (userId) => {
  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
    skip: !userId,
    fetchPolicy: 'cache-first',
  });

  return {
    user: data?.getUserById || null,
    loading,
    error: error?.message || null,
  };
};

/**
 * Hook para obtener usuario por username
 */
export const useUserByUsername = (username) => {
  const { data, loading, error } = useQuery(GET_USER_BY_USERNAME, {
    variables: { username },
    skip: !username,
    fetchPolicy: 'cache-first',
  });

  return {
    user: data?.getUserByUsername || null,
    loading,
    error: error?.message || null,
  };
};

export default useAuth;
