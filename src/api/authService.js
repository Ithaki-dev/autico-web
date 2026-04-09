import axios from './axiosConfig';

const GOOGLE_TEMP_TOKEN_KEY = 'google_temp_token';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000/api';
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');
const GOOGLE_AUTH_URL = import.meta.env.VITE_GOOGLE_AUTH_URL || `${BACKEND_BASE_URL}/api/auth/google`;

const extractAuthData = (payload) => {
  const source = payload?.data || payload;
  const token = source?.token;
  const user = source?.user;

  return {
    token,
    user,
    success: source?.success ?? payload?.success ?? Boolean(token),
    message: source?.message || payload?.message,
  };
};

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
};

const decodeJwtPayload = (token) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const segments = token.split('.');
  if (segments.length < 2) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(segments[1]));
  } catch {
    return null;
  }
};

const parseUserFromQuery = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    try {
      const decoded = decodeURIComponent(value);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }
};

const isTruthyQueryParam = (value) => {
  if (!value) {
    return false;
  }

  return ['true', '1', 'yes', 'si'].includes(String(value).toLowerCase());
};

const isFalseyQueryParam = (value) => {
  if (value == null) {
    return false;
  }

  return ['false', '0', 'no'].includes(String(value).toLowerCase());
};

const pickUsername = (source, payload) => {
  const rawUsername =
    source?.username ||
    source?.name ||
    source?.fullName ||
    source?.displayName ||
    payload?.username ||
    payload?.name ||
    payload?.fullName ||
    payload?.displayName ||
    payload?.preferred_username ||
    payload?.nickname ||
    payload?.given_name ||
    payload?.email ||
    null;

  if (!rawUsername) {
    return 'Usuario';
  }

  if (String(rawUsername).includes('@')) {
    return String(rawUsername).split('@')[0] || 'Usuario';
  }

  return String(rawUsername);
};

const normalizeAuthUser = (user, token) => {
  const payload = token ? decodeJwtPayload(token) : null;
  const source = user || {};
  const username = pickUsername(source, payload);

  return {
    ...source,
    id: source.id || source._id || source.userId || payload?.sub || payload?.id || payload?._id || payload?.userId || null,
    username,
    email: source.email || payload?.email || null,
    name: source.name || source.fullName || payload?.name || payload?.fullName || payload?.given_name || username,
  };
};

const persistAuthSession = (token, user) => {
  if (token) {
    localStorage.setItem('token', token);
  }

  const normalizedUser = normalizeAuthUser(user, token);
  if (normalizedUser) {
    localStorage.setItem('user', JSON.stringify(normalizedUser));
  }
};

export const authService = {
  validateIdentity: async (cedula) => {
    try {
      const response = await axios.post('/identity/validate', { cedula });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al validar la cédula' };
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al registrar usuario' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      const { success, token, user } = extractAuthData(response.data);
      if (success && token) {
        persistAuthSession(token, user);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al iniciar sesión' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem(GOOGLE_TEMP_TOKEN_KEY);
  },

  saveSession: (token, user) => {
    persistAuthSession(token, user);
  },

  startGoogleLogin: () => {
    window.location.href = GOOGLE_AUTH_URL;
  },

  parseGoogleAuthResult: (search) => {
    const params = new URLSearchParams(search);
    const successParam = params.get('success');
    const success = successParam == null ? null : isTruthyQueryParam(successParam);
    const token = params.get('token');
    const tempToken = params.get('tempToken') || params.get('temporaryToken');
    const requiresCedula =
      isTruthyQueryParam(params.get('requiresCedula')) ||
      isTruthyQueryParam(params.get('requireCedula')) ||
      isTruthyQueryParam(params.get('needsCedula'));
    const doesNotRequireCedula =
      isFalseyQueryParam(params.get('requiresCedula')) ||
      isFalseyQueryParam(params.get('requireCedula')) ||
      isFalseyQueryParam(params.get('needsCedula'));
    const user = parseUserFromQuery(params.get('user'));
    const error = params.get('error') || params.get('message');

    return {
      success,
      token,
      tempToken,
      requiresCedula,
      doesNotRequireCedula,
      user,
      error,
    };
  },

  getUserFromToken: (token) => {
    const payload = decodeJwtPayload(token);

    if (!payload) {
      return null;
    }

    const normalized = normalizeAuthUser({}, token);

    return {
      ...normalized,
      roles: payload.roles || payload.role ? [payload.role].filter(Boolean) : undefined,
    };
  },

  completeGoogleRegistration: async (cedula, tempToken) => {
    try {
      const response = await axios.post(
        '/auth/google/complete-registration',
        { cedula },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );

      const authData = extractAuthData(response.data);
      if (authData.success && authData.token) {
        persistAuthSession(authData.token, authData.user);
      }

      return authData;
    } catch (error) {
      throw error.response?.data || { message: 'No se pudo completar el registro con Google' };
    }
  },

  setGoogleTempToken: (tempToken) => {
    sessionStorage.setItem(GOOGLE_TEMP_TOKEN_KEY, tempToken);
  },

  getGoogleTempToken: () => {
    return sessionStorage.getItem(GOOGLE_TEMP_TOKEN_KEY);
  },

  clearGoogleTempToken: () => {
    sessionStorage.removeItem(GOOGLE_TEMP_TOKEN_KEY);
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  }
};
