import { useQuery } from '@apollo/client';
import {
  GET_VEHICLES,
  GET_VEHICLE_BY_ID,
  GET_VEHICLES_BY_BRAND,
} from '../graphql/queries/vehicles';

/**
 * Hook para listar vehículos con paginación
 */
export const useVehicles = (limit = 10, offset = 0) => {
  const { data, loading, error, refetch, fetchMore } = useQuery(GET_VEHICLES, {
    variables: { limit, offset },
    fetchPolicy: 'cache-and-network', // Muestra cache mientras busca actualizaciones
  });

  const vehicles = data?.getVehicles || [];

  const loadMore = (newLimit, newOffset) => {
    return fetchMore({
      variables: { limit: newLimit, offset: newOffset },
    });
  };

  return {
    vehicles,
    loading,
    error: error?.message || null,
    refetch,
    loadMore,
  };
};

/**
 * Hook para obtener vehículo por ID
 */
export const useVehicleById = (vehicleId) => {
  const { data, loading, error, refetch } = useQuery(GET_VEHICLE_BY_ID, {
    variables: { id: vehicleId },
    skip: !vehicleId,
    fetchPolicy: 'cache-first',
  });

  return {
    vehicle: data?.getVehicleById || null,
    loading,
    error: error?.message || null,
    refetch,
  };
};

/**
 * Hook para obtener vehículos por marca
 */
export const useVehiclesByBrand = (brand) => {
  const { data, loading, error } = useQuery(GET_VEHICLES_BY_BRAND, {
    variables: { brand },
    skip: !brand,
    fetchPolicy: 'cache-and-network',
  });

  return {
    vehicles: data?.getVehiclesByBrand || [],
    loading,
    error: error?.message || null,
  };
};

export default useVehicles;

// Compatibilidad: alias histórico `useVehicle`
export const useVehicle = useVehicleById;
