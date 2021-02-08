import {ApolloClient, InMemoryCache, ApolloLink, HttpLink} from "@apollo/client";
import { useAuthToken } from "./authToken";
import { onError } from "@apollo/client/link/error";

const onErrorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.extensions)  {
            switch (err.extensions.code) {
                case 'UNAUTHENTICATED':
                  // error code is set to UNAUTHENTICATED
                  // when AuthenticationError thrown in resolver
      
                  // modify the operation context with a new token
                  const oldHeaders = operation.getContext().headers;
                  const {jwt, generateJwt} = useAuthToken();
                  generateJwt();
                  if (jwt && jwt.project) {
                    operation.setContext({
                        headers: {
                          ...oldHeaders,
                          'X-OPENTOK-AUTH': jwt.project,
                        },
                      });
                  }
                  
                  // retry the request, returning the new observable
                  return forward(operation);
              }
        }
      }
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      // if you would also like to retry automatically on
      // network errors, we recommend that you use
      // apollo-link-retry
    }
  }
);

const httpLink = new HttpLink({
  uri: process.env.VONAGE_VIDEO_API_INSIGHTS_URL,
});

const authMiddleware = (jwt: any) =>
  new ApolloLink((operation: any, forward: any) => {
    // add the authorization to the headers
    if (jwt) {
      operation.setContext({
        headers: {
            'Content-Type': 'application/json',
            "X-OPENTOK-AUTH": jwt.project,
        },
      });
    }

    return forward(operation);
  });

const cache = new InMemoryCache({});

export const useAppApolloClient = () => {
  const {jwt} = useAuthToken();
  return new ApolloClient({
    link: ApolloLink.from([onErrorLink, authMiddleware(jwt), httpLink]),
    cache,
  });
};
