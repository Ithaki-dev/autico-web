import axios from './axiosConfig';

export const answerService = {
  // Crear una respuesta a una pregunta
  createAnswer: async (questionId, answerData) => {
    try {
      const response = await axios.post(
        `/questions/${questionId}/answer`,
        answerData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar una respuesta existente
  updateAnswer: async (questionId, answerId, answerData) => {
    try {
      const response = await axios.put(
        `/questions/${questionId}/answers/${answerId}`,
        answerData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Eliminar una respuesta
  deleteAnswer: async (questionId, answerId) => {
    try {
      const response = await axios.delete(
        `/questions/${questionId}/answers/${answerId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
