import { gql } from '@apollo/client';

// Listar vehículos con paginación
export const GET_VEHICLES = gql`
  query GetVehicles($limit: Int, $offset: Int) {
    getVehicles(limit: $limit, offset: $offset) {
      id
      brand
      model
      year
      price
      description
      images
      status
      createdAt
      updatedAt
      owner {
        id
        username
        email
      }
    }
  }
`;

// Obtener vehículo por ID (incluye preguntas)
export const GET_VEHICLE_BY_ID = gql`
  query GetVehicleById($id: ID!) {
    getVehicleById(id: $id) {
      id
      brand
      model
      year
      price
      description
      images
      status
      createdAt
      updatedAt
      owner {
        id
        username
        email
        name
        firstName
      }
    }
  }
`;

// Vehículos por marca
export const GET_VEHICLES_BY_BRAND = gql`
  query GetVehiclesByBrand($brand: String!) {
    getVehiclesByBrand(brand: $brand) {
      id
      brand
      model
      year
      price
      description
      images
      status
      createdAt
      updatedAt
      owner {
        id
        username
      }
    }
  }
`;
