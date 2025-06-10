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

export type ObjectProperties<T> = {
  [K in keyof T as IsPlainObject<NonNullable<T[K]>> extends true
    ? K
    : never]: T[K];
};

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = readonly JsonValue[];

type Prev = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]];

type IsTuple<T> = T extends readonly any[]
  ? number extends T["length"]
    ? false
    : true
  : false;

type Indices<T extends readonly any[]> = Exclude<keyof T, keyof any[]>;

export type JsonPaths<T, D extends number = 10> = D extends -1
  ? never
  : T extends JsonPrimitive
    ? never
    : T extends readonly any[]
      ? IsTuple<T> extends true
        ? // Handle tuples
          {
            [K in Indices<T>]: K extends `${number}`
              ? T[K] extends JsonPrimitive
                ? K
                : T[K] extends JsonValue
                  ? K | `${K}.${JsonPaths<T[K], Prev[D]>}`
                  : never
              : never;
          }[Indices<T>]
        : // Handle arrays
          T extends readonly (infer U)[]
          ? U extends JsonPrimitive
            ? `${number}`
            : U extends JsonValue
              ? `${number}` | `${number}.${JsonPaths<U, Prev[D]>}`
              : never
          : never
      : T extends object
        ? // Handle objects (including optional properties)
          NonNullable<
            {
              [K in keyof T]: K extends string | number
                ? T[K] extends JsonPrimitive | undefined
                  ? `${K}`
                  : T[K] extends JsonValue | undefined
                    ? `${K}` | `${K}.${JsonPaths<NonNullable<T[K]>, Prev[D]>}`
                    : never
                : never;
            }[keyof T]
          >
        : never;
