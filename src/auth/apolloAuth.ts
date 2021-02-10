import {ApolloClient, InMemoryCache, ApolloLink, HttpLink} from "@apollo/client";
import { generateJwt } from "./authToken";
import { onError } from "@apollo/client/link/error";

const ERROR_NO_AUTH_PROVIDED = 1001;

const onErrorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    console.warn(`[onErrorLink]`);
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.extensions)  {
            switch (err.extensions.code) {
                case 'UNAUTHENTICATED':
                  // error code is set to UNAUTHENTICATED
                  // when AuthenticationError thrown in resolver
      
                  // modify the operation context with a new token
                  /* const oldHeaders = operation.getContext().headers;
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
                  return forward(operation); */
              }
        }
      }
    }
    // @ts-ignore
    if (networkError && networkError.result) {
      console.error(`[Network error]: ${networkError}`);
      // @ts-ignore
      if (networkError.result.error && networkError.result.error.errorCode === ERROR_NO_AUTH_PROVIDED){
        const oldHeaders = operation.getContext().headers;
        const apiKey = sessionStorage.getItem("api_key");
        const apiSecret = sessionStorage.getItem("api_secret");
        const credentials = generateJwt(apiKey, apiSecret);
        if (credentials && credentials.project) {
          operation.setContext({
              headers: {
                ...oldHeaders,
                'X-OPENTOK-AUTH': credentials.project,
              },
            });
        }
        
        // retry the request, returning the new observable
        return forward(operation);
      }
      // if you would also like to retry automatically on
      // network errors, we recommend that you use
      // apollo-link-retry
    }
  }
);

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_VONAGE_VIDEO_API_INSIGHTS_URL,
});

const authMiddleware = (jwt: any) =>
  new ApolloLink((operation: any, forward: any) => {
    // add the authorization to the headers
    if (jwt) {
      operation.setContext({
        headers: {
            "X-OPENTOK-AUTH": jwt.project,
        },
      });
    }

    return forward(operation);
  });

const cache = new InMemoryCache({});

export const useAppApolloClient = () => {
    const apiKey = sessionStorage.getItem("api_key");
    const apiSecret = sessionStorage.getItem("api_secret");
    const credentials = generateJwt(apiKey, apiSecret);
  return new ApolloClient({
    link: ApolloLink.from([onErrorLink, authMiddleware(credentials), httpLink]),
    cache,
  });
};
