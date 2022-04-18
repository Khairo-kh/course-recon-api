import { dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
} from '../generated/graphql';
import { typedUpdateQuery } from './typedUpdateQuery';

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:8000/graphql',
  fetchOptions: { credentials: 'include' as const },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (resultParam, _args, cache, _info) => {
            typedUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              resultParam,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return { getMe: result.login.user };
                }
              }
            );
          },
          register: (resultParam, _args, cache, _info) => {
            typedUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              resultParam,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return { getMe: result.register.user };
                }
              }
            );
          },
          logout: (resultParam, _args, cache, _info) => {
            typedUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              resultParam,
              () => ({ getMe: null })
            );
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
