// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar teléfono (8 dígitos)
export const isValidPhone = (phone) => {
  const phoneRegex = /^\d{8}$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(cleaned);
};

// Validar password (mínimo 6 caracteres)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Validar año (entre 1900 y año actual + 1)
export const isValidYear = (year) => {
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear + 1;
};

// Validar precio (mayor a 0)
export const isValidPrice = (price) => {
  return price > 0;
};

// Validar URL de imagen
export const isValidImageUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => urlObj.pathname.toLowerCase().endsWith(ext));
  } catch {
    return false;
  }
};

// Validar username (alfanumérico, 3-20 caracteres)
export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};
