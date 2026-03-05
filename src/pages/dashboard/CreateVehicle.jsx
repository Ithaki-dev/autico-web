import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { vehicleService } from '../../api/vehicleService';
import VehicleForm from '../../components/vehicles/VehicleForm';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const CreateVehicle = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await vehicleService.createVehicle(data);
      if (response.success) {
        toast.success('Vehículo publicado correctamente');
        navigate('/dashboard/vehicles');
      }
    } catch (error) {
      toast.error(error.message || 'Error al publicar el vehículo');
    } finally {
      setIsLoading(false);
    }
  };

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
            Publicar Vehículo
          </h1>
          <p className="text-lg text-dark-600">
            Completa la información de tu vehículo para publicarlo
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-metal border border-dark-200 p-6 md:p-8">
          <VehicleForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default CreateVehicle;
