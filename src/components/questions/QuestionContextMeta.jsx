import { useUserById } from '../../hooks/useAuth';
import { useVehicleById } from '../../hooks/useVehicles';

const QuestionContextMeta = ({ userId, vehicleId, showVehicle = true }) => {
  const { user, loading: userLoading } = useUserById(userId);
  const { vehicle, loading: vehicleLoading } = useVehicleById(showVehicle ? vehicleId : null);

  if (userLoading || (showVehicle && vehicleLoading)) {
    return <p className="text-sm text-dark-500">Cargando contexto...</p>;
  }

  return (
    <div className="flex flex-wrap gap-3 text-sm text-dark-600">
      <span>
        Usuario: {user?.username || user?.name || userId || 'No disponible'}
      </span>
      {showVehicle && (
        <span>
          Vehículo: {vehicle ? `${vehicle.brand} ${vehicle.model}` : vehicleId || 'No disponible'}
        </span>
      )}
    </div>
  );
};

export default QuestionContextMeta;