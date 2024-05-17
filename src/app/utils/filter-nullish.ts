import { OperatorFunction, pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

export function filterNullish<T>() {
  return pipe(filter((value) => value != null) as OperatorFunction<T | null | undefined, NonNullable<T>>);
}

type INonNullableArray<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

export function filterNullishMultiple<T>() {
  return pipe(
    filter((values) => Array.isArray(values) && values.every((i) => i != null)) as OperatorFunction<
      T,
      INonNullableArray<T>
    >,
  );
}

export function filterUndefined<T>() {
  return pipe(filter((x) => x !== undefined) as OperatorFunction<T | undefined, T>);
}
