import { PackageOpen } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon = PackageOpen, 
  title = 'No hay datos', 
  description, 
  action,
  actionLabel,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 mb-4 rounded-full bg-dark-100 flex items-center justify-center">
        <Icon className="w-10 h-10 text-dark-400" />
      </div>
      <h3 className="text-xl font-bold text-dark-900 mb-2">{title}</h3>
      {description && (
        <p className="text-dark-600 max-w-md mb-6">{description}</p>
      )}
      {action && actionLabel && (
        <Button onClick={action} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
