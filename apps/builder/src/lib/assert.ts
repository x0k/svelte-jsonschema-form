export function assertThing<T>(
  thing: T | undefined,
  name: string
): asserts thing is T {
  if (thing === undefined) {
    throw new Error(`${name} is undefined`);
  }
}
