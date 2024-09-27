export type AnyKey = keyof any;

export type Get<R, T extends keyof any, D> = R extends {
  [key in T]: infer V;
}
  ? V
  : D;

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
}