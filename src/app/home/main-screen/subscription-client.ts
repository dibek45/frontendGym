import {
    ApolloClient,
    InMemoryCache,
    split,
    HttpLink,
  } from '@apollo/client/core';
  import { getMainDefinition } from '@apollo/client/utilities';
  import { WebSocketLink } from 'apollo-link-ws';
  import { ApolloLink } from '@apollo/client/core';
  
  const httpLink = new HttpLink({
    uri: 'https://api.dibeksolutions.com/graphql',
  });
  
  const wsLink = new WebSocketLink({
    uri: 'wss://api.dibeksolutions.com/graphql',
    options: {
      reconnect: true,
    },
  });
  
  const splitLink = split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return (
        def.kind === 'OperationDefinition' &&
        def.operation === 'subscription'
      );
    },
    wsLink as unknown as ApolloLink, // ⚠️ necesario para evitar error de tipo
    httpLink
  );
  
  export const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
  