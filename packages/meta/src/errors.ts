export function neverError(value: never, message: string) {
  return new Error(`${message}: ${value}`);
}
