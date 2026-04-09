import { useState, useEffect, useCallback } from 'react';
import { vehicleService } from '../api/vehicleService';
import toast from 'react-hot-toast';

export const useVehicles = (initialFilters = {}) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10
  });
  const [filters, setFilters] = useState(initialFilters);

  // Cargar vehículos
  const loadVehicles = useCallback(async (newFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleService.getVehicles(newFilters);
      if (response.success) {
        setVehicles(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      setError(err.message || 'Error al cargar vehículos');
      toast.error(err.message || 'Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Aplicar filtros
  const applyFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    loadVehicles(updatedFilters);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({});
    loadVehicles({});
  };

  // Cambiar página
  const changePage = (page) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    loadVehicles(updatedFilters);
  };

  // Cargar en el montaje
  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  return {
    vehicles,
    loading,
    error,
    pagination,
    filters,
    applyFilters,
    clearFilters,
    changePage,
    reload: loadVehicles,
  };
};

// Hook para un vehículo individual
export const useVehicle = (id) => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadVehicle = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleService.getVehicleById(id);
      if (response.success) {
        setVehicle(response.data);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar el vehículo');
      toast.error(err.message || 'Error al cargar el vehículo');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadVehicle();
  }, [loadVehicle]);

  return {
    vehicle,
    loading,
    error,
    reload: loadVehicle,
  };
};
