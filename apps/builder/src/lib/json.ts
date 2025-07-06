export type JSONParseResult<T, E> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: E;
    };

export function parseJson<T, E>(jsonStr: string): JSONParseResult<T, E> {
  try {
    return {
      ok: true,
      value: JSON.parse(jsonStr),
    };
  } catch (error) {
    return {
      ok: false,
      error: error as E,
    };
  }
}
