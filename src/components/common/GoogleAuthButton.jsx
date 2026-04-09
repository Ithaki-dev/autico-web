import Button from './Button';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.5-5.5 3.5-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 1.5l2.7-2.6C17 2.8 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.7H12z"
    />
  </svg>
);

const GoogleAuthButton = ({ onClick, disabled = false, text = 'Continuar con Google', className = '' }) => {
  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full !border-gray-300 !text-dark-800 hover:!bg-gray-50 ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      <GoogleIcon />
      {text}
    </Button>
  );
};

export default GoogleAuthButton;
