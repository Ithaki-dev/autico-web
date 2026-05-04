import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  concat,
} from '@apollo/client';

const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:5000/graphql';

// Auth Link: Agrega el token JWT en el header Authorization
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('auth_token');

  if (token) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return forward(operation);
});

// HTTP Link: Conecta con el endpoint GraphQL
const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'omit', // No enviar credenciales (evita CORS issues cuando se usa Authorization header)
});

// Apollo Client con cache configurado
const client = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Configura comportamiento de cache para paginación
          getVehicles: {
            keyArgs: false,
            merge(existing = [], incoming, { args }) {
              // Merge paginated results
              return incoming;
            },
          },
          getQuestions: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

export default client;
