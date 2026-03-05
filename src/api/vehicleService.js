import axios from './axiosConfig';

export const vehicleService = {
  // Obtener lista de vehículos con filtros y paginación
  getVehicles: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Agregar parámetros solo si existen
      if (params.brand) queryParams.append('brand', params.brand);
      if (params.model) queryParams.append('model', params.model);
      if (params.minYear) queryParams.append('minYear', params.minYear);
      if (params.maxYear) queryParams.append('maxYear', params.maxYear);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
      if (params.status) queryParams.append('status', params.status);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await axios.get(`/vehicles?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener vehículos' };
    }
  },

  // Obtener detalle de un vehículo
  getVehicleById: async (id) => {
    try {
      const response = await axios.get(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener el vehículo' };
    }
  },

  // Crear nuevo vehículo (requiere autenticación)
  createVehicle: async (vehicleData) => {
    try {
      const response = await axios.post('/vehicles', vehicleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear el vehículo' };
    }
  },

  // Actualizar vehículo (requiere autenticación y ser el owner)
  updateVehicle: async (id, vehicleData) => {
    try {
      const response = await axios.put(`/vehicles/${id}`, vehicleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el vehículo' };
    }
  },

  // Eliminar vehículo (requiere autenticación y ser el owner)
  deleteVehicle: async (id) => {
    try {
      const response = await axios.delete(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar el vehículo' };
    }
  },

  // Marcar vehículo como vendido
  markAsSold: async (id) => {
    try {
      const response = await axios.patch(`/vehicles/${id}/sold`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al marcar como vendido' };
    }
  },

  // Obtener vehículos del usuario autenticado
  getMyVehicles: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) throw new Error('Usuario no autenticado');
      
      // Filtrar por el usuario actual
      const response = await axios.get('/vehicles');
      const allVehicles = response.data.data;
      const myVehicles = allVehicles.filter(v => v.owner._id === user.id || v.owner === user.id);
      
      return {
        ...response.data,
        data: myVehicles
      };
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener mis vehículos' };
    }
  }
};
