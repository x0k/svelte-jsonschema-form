// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/orderProperties.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import type { Schema } from "./schema.js";

const errorPropList = (arr: string[]) =>
  arr.length > 1 ? `properties '${arr.join("', '")}'` : `property '${arr[0]}'`;

export function orderProperties(
  properties: Exclude<Schema["properties"], undefined>,
  order: string[] | undefined
): string[] {
  const keys = Object.keys(properties);
  if (order === undefined) {
    return keys;
  }
  const orderFiltered = order.filter(
    (prop) => prop === "*" || properties[prop]
  );
  const orderSet = new Set(orderFiltered);

  const rest = keys.filter((prop: string) => !orderSet.has(prop));
  const restIndex = orderFiltered.indexOf("*");
  if (restIndex === -1) {
    if (rest.length) {
      throw new Error(
        `uiSchema order list does not contain ${errorPropList(rest)}`
      );
    }
    return orderFiltered;
  }
  if (restIndex !== orderFiltered.lastIndexOf("*")) {
    throw new Error("uiSchema order list contains more than one wildcard item");
  }

  orderFiltered.splice(restIndex, 1, ...rest);
  return orderFiltered;
}
