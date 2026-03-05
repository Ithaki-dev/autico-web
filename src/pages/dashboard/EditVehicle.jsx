import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { vehicleService } from '../../api/vehicleService';
import { useVehicle } from '../../hooks/useVehicles';
import VehicleForm from '../../components/vehicles/VehicleForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicle, loading } = useVehicle(id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await vehicleService.updateVehicle(id, data);
      if (response.success) {
        toast.success('Vehículo actualizado correctamente');
        navigate('/dashboard/vehicles');
      }
    } catch (error) {
      toast.error(error.message || 'Error al actualizar el vehículo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Cargando vehículo..." />;
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-900 mb-2">Vehículo no encontrado</h2>
          <p className="text-dark-600 mb-6">El vehículo que intentas editar no existe</p>
          <button
            onClick={() => navigate('/dashboard/vehicles')}
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Volver a Mis Vehículos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/vehicles')}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Mis Vehículos
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-black text-dark-900 mb-2">
            Editar Vehículo
          </h1>
          <p className="text-lg text-dark-600">
            {vehicle.brand} {vehicle.model} {vehicle.year}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-metal border border-dark-200 p-6 md:p-8">
          <VehicleForm 
            onSubmit={handleSubmit} 
            initialData={vehicle} 
            isLoading={isSubmitting} 
          />
        </div>
      </div>
    </div>
  );
};

export default EditVehicle;
