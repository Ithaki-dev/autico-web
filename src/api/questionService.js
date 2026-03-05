import axios from './axiosConfig';

export const questionService = {
  // Crear pregunta sobre un vehículo (requiere autenticación)
  createQuestion: async (vehicleId, questionText) => {
    try {
      const response = await axios.post(`/vehicles/${vehicleId}/questions`, {
        text: questionText
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear la pregunta' };
    }
  },

  // Obtener preguntas de un vehículo
  getVehicleQuestions: async (vehicleId) => {
    try {
      // Las preguntas vienen en el detalle del vehículo
      const response = await axios.get(`/vehicles/${vehicleId}`);
      return response.data.data.questions || [];
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener preguntas' };
    }
  },

  // Obtener mis preguntas (requiere autenticación)
  getMyQuestions: async () => {
    try {
      const response = await axios.get('/my/questions');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener mis preguntas' };
    }
  },

  // Responder pregunta (solo owner del vehículo)
  answerQuestion: async (questionId, answerText) => {
    try {
      const response = await axios.post(`/questions/${questionId}/answer`, {
        text: answerText
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al responder la pregunta' };
    }
  }
};
