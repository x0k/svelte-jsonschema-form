export function constant<T>(data: T) {
  return () => data;
}
