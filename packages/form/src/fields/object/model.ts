import {
  ADDITIONAL_PROPERTY_FLAG,
  type Schema,
  type SchemaObjectValue,
} from "#core/index.js";
import { isSchemaObject } from "#lib/json-schema/index.js";

export type AdditionalPropertyKey = (key: string, attempt: number) => string;

export function generateNewKey(
  value: SchemaObjectValue,
  preferredKey: string,
  additionalPropertyKey: AdditionalPropertyKey
) {
  let index = 0;
  let newKey: string;
  do {
    newKey = additionalPropertyKey(preferredKey, index++);
  } while (newKey in value);
  return newKey;
}

export function createAdditionalPropertyKey(
  preferredKey: string,
  attempt: number
) {
  return attempt === 0 ? preferredKey : `${preferredKey}-${attempt}`;
}

/**
 * Returns the stable key of a property. A renamed property keeps the key it
 * had before the rename, so its component instance survives. A property that
 * takes a key held by a renamed property gets a variant of its own name.
 *
 * `heldKeys` is `collectHeldKeys` of the same rename map and rendered
 * properties, passed in because it is the same for every property while this
 * runs for each of them on every render.
 */
export function stableKeyOf(
  renamedKeys: ReadonlyMap<string, string>,
  property: string,
  heldKeys: ReadonlySet<string>
) {
  if (renamedKeys.size === 0) {
    return property;
  }
  const renamedKey = renamedKeys.get(property);
  if (renamedKey !== undefined) {
    return renamedKey;
  }
  return freeKey(property, heldKeys);
}

/**
 * The keys the renamed properties that are rendered hold, which no other
 * property may take. A rename counts as held only while its property is
 * rendered, since a parent that stores a rename later still renders the
 * property under its old name, which must keep its key.
 */
export function collectHeldKeys(
  renamedKeys: ReadonlyMap<string, string>,
  properties: Exclude<Schema["properties"], undefined>
): Set<string> {
  const heldKeys = new Set<string>();
  for (const [name, held] of renamedKeys) {
    if (Object.hasOwn(properties, name)) {
      heldKeys.add(held);
    }
  }
  return heldKeys;
}

/**
 * A variant of the property's name that no renamed property holds.
 *
 * NOTE: a property whose own name ends in the appended NUL can still collide,
 * which `each` reports as a duplicate key. Such names are not worth a
 * per-property counter.
 */
function freeKey(property: string, heldKeys: ReadonlySet<string>) {
  let key = property;
  while (heldKeys.has(key)) {
    key += "\0";
  }
  return key;
}

/** Records that `property` was renamed to `newProperty`, keeping the key it
 * rendered under. `heldKeys` is `collectHeldKeys` of `renamedKeys`. */
export function withRenamedKey(
  renamedKeys: ReadonlyMap<string, string>,
  property: string,
  newProperty: string,
  heldKeys: ReadonlySet<string>
) {
  const key = stableKeyOf(renamedKeys, property, heldKeys);
  const next = new Map<string, string>();
  for (const [name, held] of renamedKeys) {
    if (held !== key) {
      next.set(name, held);
    }
  }
  next.set(newProperty, key);
  return next;
}

/** Forgets a removed property's rename. A property whose key would change
 * because the removed one held a variant of it keeps the variant. */
export function withoutRenamedKey(
  renamedKeys: ReadonlyMap<string, string>,
  property: string,
  properties: Exclude<Schema["properties"], undefined>
) {
  if (!renamedKeys.has(property)) {
    return renamedKeys;
  }
  const next = new Map<string, string>();
  for (const [name, held] of renamedKeys) {
    if (name !== property) {
      next.set(name, held);
    }
  }
  const heldBefore = collectHeldKeys(renamedKeys, properties);
  const heldAfter = collectHeldKeys(next, properties);
  for (const name of Object.keys(properties)) {
    if (name === property) {
      continue;
    }
    const key = renamedKeys.get(name) ?? freeKey(name, heldBefore);
    if (key !== (next.get(name) ?? freeKey(name, heldAfter))) {
      next.set(name, key);
      heldAfter.add(key);
    }
  }
  return next;
}

export function createOriginalKeysOrder(
  properties: Exclude<Schema["properties"], undefined>
): string[] {
  const order: string[] = [];
  const keys = Object.keys(properties);
  for (const key of keys) {
    const property = properties[key]!;
    if (!isSchemaObject(property) || ADDITIONAL_PROPERTY_FLAG in property) {
      continue;
    }
    order.push(key);
  }
  if (order.length < keys.length) {
    order.push("*");
  }
  return order;
}
