export type AnyKey = keyof any;

type Decr = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export type ValuesOf<T, D extends number = 3> = D extends 0
  ? T
  :
      | T
      | (T extends Array<infer U>
          ? ValuesOf<U, Decr[D]>
          : T extends Record<string, infer U>
            ? ValuesOf<U, Decr[D]>
            : T extends object
              ? { [k in keyof T]: ValuesOf<T[k], Decr[D]> }[keyof T]
              : never);

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

declare const brand: unique symbol;

export type Brand<Name extends string, Base = string> = Base & {
  readonly [brand]: Name
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type MaybePromise<T> = T | Promise<T>;

export type Nil = null | undefined;

export function isNil<T>(v: T | Nil): v is Nil {
  return v === undefined || v === null;
}

export type Equal<A, B> = A extends B ? (B extends A ? true : false) : false;

export type Expand<T> = { [K in keyof T]: T[K] };

export type ExpandAndEqual<A, B> = Equal<Expand<A>, Expand<B>>
