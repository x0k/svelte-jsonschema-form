export function noop() {}

export function constUndefined() {
  return undefined;
}

export function identity<T>(v: T): T {
  return v;
}
