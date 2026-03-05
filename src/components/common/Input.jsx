import { clsx } from 'clsx';
import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text',
  className = '',
  containerClassName = '',
  required = false,
  ...props 
}, ref) => {
  return (
    <div className={clsx('w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-semibold text-dark-800 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={clsx(
          'w-full px-4 py-2.5 bg-white border-2 rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'placeholder:text-gray-400',
          error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-dark-200 hover:border-dark-300',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
