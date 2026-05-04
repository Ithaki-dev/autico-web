import { useQuery } from '@apollo/client';
import {
  GET_QUESTIONS,
  GET_QUESTION_BY_ID,
  GET_QUESTIONS_BY_VEHICLE,
  GET_ANSWERS_FOR_QUESTION,
} from '../graphql/queries/questions';

/**
 * Hook para listar preguntas con paginación
 */
export const useQuestions = (limit = 10, offset = 0) => {
  const { data, loading, error, refetch, fetchMore } = useQuery(GET_QUESTIONS, {
    variables: { limit, offset },
    fetchPolicy: 'cache-and-network',
  });

  const questions = data?.getQuestions || [];

  const loadMore = (newLimit, newOffset) => {
    return fetchMore({
      variables: { limit: newLimit, offset: newOffset },
    });
  };

  return {
    questions,
    loading,
    error: error?.message || null,
    refetch,
    loadMore,
  };
};

/**
 * Hook para obtener pregunta por ID (incluye respuestas)
 */
export const useQuestionById = (questionId) => {
  const { data, loading, error, refetch } = useQuery(GET_QUESTION_BY_ID, {
    variables: { id: questionId },
    skip: !questionId,
    fetchPolicy: 'cache-first',
  });

  return {
    question: data?.getQuestionById || null,
    loading,
    error: error?.message || null,
    refetch,
  };
};

/**
 * Hook para obtener preguntas de un vehículo
 */
export const useQuestionsByVehicle = (vehicleId) => {
  const { data, loading, error, refetch } = useQuery(GET_QUESTIONS_BY_VEHICLE, {
    variables: { vehicleId },
    skip: !vehicleId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    questions: data?.getQuestionsByVehicle || [],
    loading,
    error: error?.message || null,
    refetch,
  };
};

/**
 * Hook para obtener respuestas de una pregunta
 */
export const useAnswersForQuestion = (questionId, enabled = true) => {
  const { data, loading, error } = useQuery(GET_ANSWERS_FOR_QUESTION, {
    variables: { questionId },
    skip: !questionId || !enabled,
    fetchPolicy: 'cache-and-network',
  });

  return {
    answers: data?.getAnswersForQuestion || [],
    loading,
    error: error?.message || null,
  };
};
