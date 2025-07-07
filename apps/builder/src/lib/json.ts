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

export function isValidJson(jsonStr: string) {
  return parseJson(jsonStr).ok;
}

export function isJsonValueObject(jsonStr: string) {
  return jsonStr.startsWith("{");
}

export function isJsonValueArray(jsonStr: string) {
  return jsonStr.startsWith("[");
}

export function isJsonValueString(jsonStr: string) {
  return jsonStr.startsWith('"');
}

export function isJsonValueNumber(jsonStr: string) {
  return (jsonStr[0] >= "0" && jsonStr[0] <= "9") || jsonStr[0] === "-";
}

export function isJsonValueBoolean(jsonStr: string) {
  return jsonStr === "true" || jsonStr === "false";
}
