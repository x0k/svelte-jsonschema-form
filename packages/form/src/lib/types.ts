export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

declare const brand: unique symbol;

export type Brand<Name extends string, Base = string> = Base & {
  readonly [brand]: Name;
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type MaybePromise<T> = T | Promise<T>;

export type Nil = null | undefined;

export function isNil<T>(v: T | Nil): v is Nil {
  return v === undefined || v === null;
}

export type Expand<T> = { [K in keyof T]: T[K] };

export type IsPlainObject<T> = T extends object
  ? T extends (...args: any) => any
    ? false
    : T extends any[]
    ? false
    : true
  : false;
