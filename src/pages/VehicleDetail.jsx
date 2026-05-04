import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useVehicleById } from '../hooks/useVehicles';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ImageGallery from '../components/vehicles/ImageGallery';
import QuestionsByVehicle from '../components/questions/QuestionsByVehicle';

const VehicleDetail = () => {
  const { id } = useParams();
  const { vehicle, loading, error } = useVehicleById(id);

  if (loading) {
    return <LoadingSpinner fullScreen text="Cargando vehículo..." />;
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark-900 mb-2">Vehículo no encontrado</h2>
          <p className="text-dark-600 mb-6">{error || 'El vehículo que buscas no existe o ha sido eliminado'}</p>
          <Link to="/vehicles">
            <Button variant="primary">Volver al catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/vehicles" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-metal border border-dark-200 p-6">
              <ImageGallery images={vehicle.images || []} />
            </div>
            {/* Vehicle Info */}
            <div className="bg-white rounded-xl shadow-metal border border-dark-200 p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-black text-dark-900 mb-2">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-dark-600">{vehicle.year}</span>
                    <Badge variant="success">Disponible</Badge>
                  </div>
                </div>
                <div className="w-full sm:w-auto text-left sm:text-right">
                  <p className="text-2xl sm:text-4xl font-black text-secondary-500 break-words">
                    ${vehicle.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Description */}
              {vehicle.description && (
                <div className="pt-6 border-t border-dark-200">
                  <h3 className="text-lg font-bold text-dark-900 mb-3">Descripción</h3>
                  <p className="text-dark-700 whitespace-pre-line leading-relaxed">
                    {vehicle.description}
                  </p>
                </div>
              )}

              {/* Details */}
              <div className="pt-6 border-t border-dark-200 mt-6">
                <h3 className="text-lg font-bold text-dark-900 mb-4">Detalles del Vehículo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-dark-600 mb-1">Marca</p>
                    <p className="font-bold text-dark-900">{vehicle.brand}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-dark-600 mb-1">Modelo</p>
                    <p className="font-bold text-dark-900">{vehicle.model}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-dark-600 mb-1">Año</p>
                    <p className="font-bold text-dark-900">{vehicle.year}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-dark-600 mb-1">Precio</p>
                    <p className="font-bold text-secondary-500">${vehicle.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions & Answers */}
            <div className="bg-white rounded-xl shadow-metal border border-dark-200 p-6">
              <h3 className="text-xl font-bold text-dark-900 mb-6">
                Preguntas y Respuestas
              </h3>

              <QuestionsByVehicle vehicleId={id} vehicleOwner={vehicle.owner} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <div className="bg-white rounded-xl shadow-metal border border-dark-200 p-6">
              <h3 className="text-lg font-bold text-dark-900 mb-4">Información del Vendedor</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-dark-600 mb-1">Nombre</p>
                  <p className="font-semibold text-dark-900">
                    {vehicle.owner?.firstName || vehicle.owner?.name || 'No disponible'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dark-600 mb-1">Usuario</p>
                  <p className="font-semibold text-dark-900">{vehicle.owner?.username}</p>
                </div>
                {vehicle.owner?.email && (
                  <div>
                    <p className="text-sm text-dark-600 mb-1">Email</p>
                    <p className="font-semibold text-dark-900 break-words text-xs">{vehicle.owner.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
