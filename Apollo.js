import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, Observable, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import AsyncStorage from "@react-native-community/async-storage";



const request = async (operation) => {
  const token = await AsyncStorage.getItem('jwt');
  operation.setContext({
    headers: { Authorization: `Bearer ${token}` }
  });
};

const requestLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle;
    Promise.resolve(operation)
      .then(oper => request(oper))
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch(observer.error.bind(observer));

    return () => {
      if (handle) handle.unsubscribe();
    };
  })
);

const httpLink = new HttpLink({
    // uri: "http://172.30.1.23:4000"
    uri: "https://semicolon-backend.herokuapp.com"
});

const wsLink = new WebSocketLink({
    // uri: `ws://172.30.1.23:4000`,
    uri: "https://semicolon-backend.herokuapp.com",
  options: {
    reconnect: true
  }
});

export default async () => {
    
    const cache = new InMemoryCache({});

    await persistCache({
        cache,
        storage: AsyncStorage,
    });
    
    cache.writeData({
        data: {
            isConnected: true
        }
    });
    
return (new ApolloClient({
        link: ApolloLink.from([
            onError(({ graphQLErrors, networkError }) => {
                if (graphQLErrors)
                    graphQLErrors.map(({ message, locations, path }) =>
                        console.log(
                            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                        )
                    );
                if (networkError) console.log(`[Network error]: ${networkError}`);
            }),
            requestLink,
            split(
                // split based on operation type
                ({ query }) => {
                    const definition = getMainDefinition(query);
                    return (
                        definition.kind === "OperationDefinition" &&
                        definition.operation === "subscription"
                    );
                },
                wsLink,
                httpLink
            )
        ]),
  cache,
  resolvers: {
    Mutation: {
      updateNetworkStatus: (_, { isConnected }, { cache }) => {
        cache.writeData({ data: { isConnected }});
        return null;
      }
    }
  },
})
    )
};
