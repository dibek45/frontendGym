import { createClient } from 'graphql-ws';
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';

const wsLink = new GraphQLWsLink(
    createClient({
      url: 'wss://api.dibeksolutions.com/graphql', // para subscriptions
    })
  );
  
  const httpLink = new HttpLink({
   uri: 'https://api.dibeksolutions.com/graphql', // para queries/mutations
  });
  
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
