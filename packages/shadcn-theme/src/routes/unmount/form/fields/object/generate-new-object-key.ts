import type { SchemaObjectValue } from "@sjsf/form/core";

export function generateNewKey(
  preferredKey: string,
  newKeySeparator: string,
  value: SchemaObjectValue
) {
  let index = 0;
  let newKey = preferredKey;
  while (newKey in value) {
    newKey = `${preferredKey}${newKeySeparator}${++index}`;
  }
  return newKey;
}
