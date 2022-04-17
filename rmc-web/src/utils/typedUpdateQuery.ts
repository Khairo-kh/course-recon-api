import { QueryInput, Cache } from '@urql/exchange-graphcache';

export function typedUpdateQuery<Result, Query>(
  cache: Cache,
  input: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(input, (data) => fn(result, data as any) as any);
}
