import axios from './axiosConfig';

export const questionService = {
  // Crear pregunta sobre un vehículo (requiere autenticación)
  createQuestion: async (vehicleId, questionText) => {
    try {
      const response = await axios.post(`/vehicles/${vehicleId}/questions`, {
        text: questionText,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear la pregunta' };
    }
  },
};
