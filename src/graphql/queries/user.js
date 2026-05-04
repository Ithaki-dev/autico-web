import { gql } from '@apollo/client';

// Consulta del usuario actual
export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      name
      cedula
      firstName
      lastName1
      lastName2
      phone
      provider
      isRegistrationComplete
      isVerified
      createdAt
      updatedAt
    }
  }
`;

// Consulta de usuario por ID
export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      username
      email
      name
      cedula
      firstName
      lastName1
      lastName2
      phone
      provider
      isRegistrationComplete
      isVerified
      createdAt
      updatedAt
    }
  }
`;

// Consulta de usuario por username
export const GET_USER_BY_USERNAME = gql`
  query GetUserByUsername($username: String!) {
    getUserByUsername(username: $username) {
      id
      username
      email
      name
      cedula
      firstName
      lastName1
      lastName2
      phone
      provider
      isRegistrationComplete
      isVerified
      createdAt
      updatedAt
    }
  }
`;
