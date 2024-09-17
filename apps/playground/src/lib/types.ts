export type PropOrDefault<R, T extends keyof any, D> = R extends {
  [key in T]: infer V;
}
  ? V
  : D;
