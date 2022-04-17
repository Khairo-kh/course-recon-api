import { queries } from '@chakra-ui/color-mode/dist/declarations/src/color-mode.utils';
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { Cache, cacheExchange, QueryInput } from '@urql/exchange-graphcache';
import { ResolveLayoutTransition } from 'framer-motion';
import { Provider, createClient, dedupExchange, fetchExchange } from 'urql';
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../generated/graphql';

import theme from '../theme';

function typedUpdateQuery<Result, Query>(
  cache: Cache,
  input: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(input, (data) => fn(result, data as any) as any);
}

const client = createClient({
  url: 'http://localhost:8000/graphql',
  fetchOptions: { credentials: 'include' },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result, args, cache, info) => {
            typedUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return { getMe: result.login.user };
                }
              }
            );
          },
          register: (_result, args, cache, info) => {
            typedUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return { getMe: result.register.user };
                }
              }
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
});
function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
