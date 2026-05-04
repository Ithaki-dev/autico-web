import { gql } from '@apollo/client';

// Listar preguntas con paginación
export const GET_QUESTIONS = gql`
  query GetQuestions($limit: Int, $offset: Int) {
    getQuestions(limit: $limit, offset: $offset) {
      id
      text
      createdAt
      updatedAt
      user {
        id
      }
      vehicle {
        id
      }
      answer {
        text
        createdAt
        updatedAt
        user {
          id
        }
      }
    }
  }
`;

// Obtener pregunta por ID
export const GET_QUESTION_BY_ID = gql`
  query GetQuestionById($id: ID!) {
    getQuestionById(id: $id) {
      id
      text
      createdAt
      updatedAt
      user {
        id
      }
      vehicle {
        id
      }
      answer {
        text
        createdAt
        updatedAt
        user {
          id
        }
      }
    }
  }
`;

// Preguntas por vehículo
export const GET_QUESTIONS_BY_VEHICLE = gql`
  query GetQuestionsByVehicle($vehicleId: ID!) {
    getQuestionsByVehicle(vehicleId: $vehicleId) {
      id
      text
      createdAt
      updatedAt
      user {
        id
      }
      vehicle {
        id
      }
      answer {
        text
        createdAt
        updatedAt
        user {
          id
        }
      }
    }
  }
`;

// Respuestas para una pregunta
export const GET_ANSWERS_FOR_QUESTION = gql`
  query GetAnswersForQuestion($questionId: ID!) {
    getAnswersForQuestion(questionId: $questionId) {
      createdAt
      updatedAt
      text
      user {
        id
      }
    }
  }
`;
