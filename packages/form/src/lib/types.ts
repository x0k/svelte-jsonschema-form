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
  [
    K in keyof T as IsPlainObject<NonNullable<T[K]>> extends true ? K : never
  ]: T[K];
};

type JsonPrimitive = string | number | boolean | null;

type Prev = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]];

type Indices<T extends readonly any[]> = Exclude<keyof T, keyof any[]>;

export type JsonPaths<T, D extends number = 10> = D extends -1
  ? never
  : T extends JsonPrimitive
    ? never
    : T extends readonly any[]
      ? number extends T["length"]
        ? // non-tuple arrays like T[]
          T extends readonly (infer U)[]
          ? U extends JsonPrimitive
            ? [number]
            : [number] | [number, ...JsonPaths<U, Prev[D]>]
          : never
        : // fixed-length tuple
          {
            [K in Indices<T>]: K extends `${infer N extends number}`
              ? T[K] extends JsonPrimitive
                ? [N]
                : [N] | [N, ...JsonPaths<T[K], Prev[D]>]
              : never;
          }[Indices<T>]
      : T extends object
        ? NonNullable<
            {
              [K in keyof T]: K extends string | number
                ? T[K] extends JsonPrimitive | undefined
                  ? [K]
                  : [K] | [K, ...JsonPaths<NonNullable<T[K]>, Prev[D]>]
                : never;
            }[keyof T]
          >
        : never;

/**
 * Whether `T` has a callable member.
 *
 * Class instances such as `File`, `Blob`, or `Date` have methods, while plain
 * records do not, so this tells them apart at the type level.
 */
type HasMethod<T> = true extends {
  [K in keyof T]-?: T[K] extends (...args: never[]) => unknown ? true : false;
}[keyof T]
  ? true
  : false;

/**
 * Recursively marks object properties as optional.
 *
 * Class instances are kept as-is: `SchemaValues` is augmentable, so a form
 * value can be a `File`, a `Date`, or any other custom instance. Making their
 * members optional would lose their identity and break assignment.
 */
export type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly unknown[]
    ? { [K in keyof T]: DeepPartial<T[K]> | undefined }
    : T extends object
      ? HasMethod<T> extends true
        ? T
        : { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

/**
 * Recursively marks arrays and plain object properties as `readonly`.
 *
 * Class instances are kept as-is: `SchemaValues` is augmentable, so a form
 * value can be a `File`, a `Date`, or any other custom instance. Mapping their
 * members into a plain readonly object would lose their identity and break
 * narrowing (`isSchemaObjectValue`) and assignment.
 */
export type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly unknown[]
    ? T extends readonly [unknown, ...unknown[]] | readonly []
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : ReadonlyArray<DeepReadonly<T[number]>>
    : T extends object
      ? HasMethod<T> extends true
        ? T
        : { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

export type OmitItems<
  Args extends unknown[],
  Bind extends unknown[],
  Never = never,
> = Args extends [...Bind, ...infer Rest] ? Rest : Never;
