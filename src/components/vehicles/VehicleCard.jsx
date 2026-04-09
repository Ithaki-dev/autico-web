import { Link } from 'react-router-dom';
import { Calendar, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '../../utils/formatters';
import Badge from '../common/Badge';

const VehicleCard = ({ vehicle }) => {
  const mainImage = vehicle.images?.[0] || 'https://via.placeholder.com/400x300?text=Sin+Imagen';
  const isAvailable = vehicle.status === 'available';

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link to={`/vehicles/${vehicle._id}`}>
        <div className="bg-white rounded-xl overflow-hidden shadow-metal metal-hover border border-dark-200">
          {/* Image */}
          <div className="relative h-48 overflow-hidden bg-dark-100">
            <img
              src={mainImage}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
              }}
            />
            <div className="img-overlay" />
            
            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <Badge 
                variant={isAvailable ? 'success' : 'danger'}
                className={`${isAvailable ? 'bg-green-500' : 'bg-red-500'} text-white font-bold shadow-lg`}
              >
                {isAvailable ? 'Disponible' : 'Vendido'}
              </Badge>
            </div>
            
            {/* Year Badge */}
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center space-x-1 bg-dark-950/80 backdrop-blur-sm px-3 py-1 rounded-full">
                <Calendar className="w-3 h-3 text-warning-400" />
                <span className="text-xs font-bold text-white">{vehicle.year}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Brand & Model */}
            <h3 className="text-xl font-display font-bold text-dark-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {vehicle.brand} {vehicle.model}
            </h3>

            {/* Price */}
            <div className="mb-3">
              <p className="text-3xl font-black text-secondary-500">
                {formatPrice(vehicle.price)}
              </p>
            </div>

            {/* Description */}
            {vehicle.description && (
              <p className="text-sm text-dark-600 mb-3 line-clamp-2">
                {vehicle.description}
              </p>
            )}

            {/* Footer info */}
            <div className="flex items-center justify-between pt-3 border-t border-dark-100">
              <div className="flex items-center space-x-1 text-dark-500">
                <Eye className="w-4 h-4" />
                <span className="text-xs font-semibold">Ver detalles</span>
              </div>
              {vehicle.owner?.username && (
                <div className="flex items-center space-x-1 text-dark-500">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {vehicle.owner.username[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs font-semibold">{vehicle.owner.username}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default VehicleCard;
