import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, split } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

export function createApollo(httpLink: HttpLink) {
  const http = httpLink.create({ uri: 'https://api.dibeksolutions.com/graphql' });

  const ws = new WebSocketLink({
    uri: 'wss://api.dibeksolutions.com/graphql',
    options: {
      reconnect: true,
    },
  });

  const link = split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return def.kind === 'OperationDefinition' && def.operation === 'subscription';
    },
    ws,
    http
  );

  return {
    link,
    cache: new InMemoryCache(),
  };
}
