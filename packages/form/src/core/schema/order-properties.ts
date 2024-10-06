import type { Schema } from "./schema";

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
