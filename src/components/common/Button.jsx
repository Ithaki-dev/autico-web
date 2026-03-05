import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-metal hover:shadow-metal-lg',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500 shadow-metal hover:shadow-metal-lg',
    warning: 'bg-warning-400 text-dark-900 hover:bg-warning-500 focus:ring-warning-400 shadow-metal hover:shadow-metal-lg',
    outline: 'border-2 border-dark-300 text-dark-800 hover:bg-dark-50 focus:ring-dark-400',
    ghost: 'text-dark-700 hover:bg-dark-100 focus:ring-dark-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-metal',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
