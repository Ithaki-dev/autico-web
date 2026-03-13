import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Plus, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { vehicleService } from '../../api/vehicleService';
import VehicleCard from '../../components/vehicles/VehicleCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, vehicleId: null, vehicleName: '' });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadMyVehicles();
  }, []);

  const loadMyVehicles = async () => {
    setLoading(true);
    try {
      const response = await vehicleService.getMyVehicles();
      if (response.success) {
        setVehicles(response.data);
      }
    } catch (error) {
      toast.error('Error al cargar tus vehículos');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSold = async (id) => {
    try {
      await vehicleService.markAsSold(id);
      toast.success('Vehículo marcado como vendido');
      loadMyVehicles();
    } catch (error) {
      toast.error('Error al marcar como vendido');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await vehicleService.deleteVehicle(deleteModal.vehicleId);
      toast.success('Vehículo eliminado correctamente');
      setDeleteModal({ isOpen: false, vehicleId: null, vehicleName: '' });
      loadMyVehicles();
    } catch (error) {
      toast.error('Error al eliminar el vehículo');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Cargando tus vehículos..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-black text-dark-900 mb-2">
              Mis Vehículos
            </h1>
            <p className="text-lg text-dark-600">
              {vehicles.length} vehículo{vehicles.length !== 1 ? 's' : ''} publicado{vehicles.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/dashboard/vehicles/new">
            <Button variant="warning" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Publicar Vehículo
            </Button>
          </Link>
        </div>

        {vehicles.length === 0 ? (
          <EmptyState
            icon={Car}
            title="No tienes vehículos publicados"
            description="Comienza a vender publicando tu primer vehículo"
            action={() => window.location.href = '/dashboard/vehicles/new'}
            actionLabel="Publicar Ahora"
          />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {vehicles.map((vehicle) => (
              <motion.div
                key={vehicle._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-metal border border-dark-200 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                  {/* Image */}
                  <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
                    <img
                      src={vehicle.images?.[0] || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={vehicle.status === 'available' ? 'success' : 'danger'}>
                        {vehicle.status === 'available' ? 'Disponible' : 'Vendido'}
                      </Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="md:col-span-2 flex flex-col justify-between">
                    <div>
                      <Link to={`/vehicles/${vehicle._id}`}>
                        <h3 className="text-2xl font-display font-bold text-dark-900 hover:text-primary-600 transition-colors mb-2">
                          {vehicle.brand} {vehicle.model}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <Badge variant="default">{vehicle.year}</Badge>
                        <span className="text-2xl font-black text-secondary-500">
                          {new Intl.NumberFormat('es-CR', {
                            style: 'currency',
                            currency: 'CRC',
                            minimumFractionDigits: 0,
                          }).format(vehicle.price)}
                        </span>
                      </div>
                      {vehicle.description && (
                        <p className="text-dark-600 line-clamp-2 mb-4">{vehicle.description}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/vehicles/${vehicle._id}`}>
                        <Button variant="outline" size="sm">
                          <Car className="w-4 h-4 mr-2" />
                          Ver Detalle
                        </Button>
                      </Link>
                      {vehicle.status === 'available' && (
                        <>
                          <Link to={`/dashboard/vehicles/${vehicle._id}/edit`}>
                            <Button variant="primary" size="sm">
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                          </Link>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleMarkAsSold(vehicle._id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Marcar Vendido
                          </Button>
                        </>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            vehicleId: vehicle._id,
                            vehicleName: `${vehicle.brand} ${vehicle.model}`,
                          })
                        }
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, vehicleId: null, vehicleName: '' })}
          title="Confirmar Eliminación"
          size="sm"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-center text-dark-700">
              ¿Estás seguro de que deseas eliminar{' '}
              <span className="font-bold">{deleteModal.vehicleName}</span>?
            </p>
            <p className="text-center text-sm text-dark-500">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteModal({ isOpen: false, vehicleId: null, vehicleName: '' })}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDelete}
                loading={deleting}
                disabled={deleting}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default MyVehicles;
