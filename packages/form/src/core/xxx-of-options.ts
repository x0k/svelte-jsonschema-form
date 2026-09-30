import { ANY_OF_KEY, ONE_OF_KEY } from "./schema.js";

export type XxxOfKey = typeof ANY_OF_KEY | typeof ONE_OF_KEY;

/**
 * Anything carrying an `anyOf`/`oneOf` pair of option lists — a `Schema` or a
 * `UiSchema`, which resolves its options through the same rule.
 */
export interface HasXxxOf<T = unknown> {
  anyOf?: T[] | undefined;
  oneOf?: T[] | undefined;
}

/**
 * The `oneOf`/`anyOf` options of a schema, along with the keyword they were read
 * from.
 */
export interface XxxOfOptions<T = unknown> {
  key: XxxOfKey;
  options: T[];
}

/**
 * Returns the keyword whose options are rendered for `schema`. `anyOf` wins when
 * a schema carries both keywords, unless its list is empty and the `oneOf`'s is
 * not, since an empty list offers nothing to render. Every reader of the options
 * goes through here, so the select, its labels, its sanitizing, its defaults and
 * the rendered field all agree on the one list that is on screen.
 */
export function getXxxOfKey(schema: HasXxxOf): XxxOfKey | undefined {
  const anyOf = schema[ANY_OF_KEY];
  const oneOf = schema[ONE_OF_KEY];
  if (
    Array.isArray(anyOf) &&
    (anyOf.length > 0 || !Array.isArray(oneOf) || oneOf.length === 0)
  ) {
    return ANY_OF_KEY;
  }
  if (Array.isArray(oneOf)) {
    return ONE_OF_KEY;
  }
  return undefined;
}

/**
 * Returns the `anyOf`/`oneOf` options that are rendered for `schema`, along with
 * the keyword they are read from. An empty list offers no option to render, pick
 * a default from or take a type from, so the schema is handled through its own
 * type instead, the same as one carrying neither keyword.
 */
export function getXxxOfOptions<T>(
  schema: HasXxxOf<T>
): XxxOfOptions<T> | undefined {
  const key = getXxxOfKey(schema);
  if (key === undefined) {
    return undefined;
  }
  const options = schema[key];
  if (!Array.isArray(options) || options.length === 0) {
    return undefined;
  }
  return { key, options };
}

/**
 * Returns `schema`'s non-empty `allOf` members, if it has any.
 *
 * A reader that infers a single type wants `allOf` to win over `oneOf`/`anyOf`,
 * because every `allOf` member applies while only one `oneOf`/`anyOf` option
 * does. Collecting both, as {@link getSubSchemaOptions} does, would make
 * `isSchemaNullable()` report an `allOf`-constrained object as nullable because
 * some `oneOf` option allows `null`.
 */
export function getAllOfOptions<T>(schema: {
  allOf?: T[] | undefined;
}): T[] | undefined {
  const allOf = schema.allOf;
  return Array.isArray(allOf) && allOf.length > 0 ? allOf : undefined;
}

/**
 * Returns every subschema a path may descend into: the non-empty `allOf`
 * members, followed by the rendered `oneOf`/`anyOf` options.
 *
 * Unlike {@link getXxxOfOptions}, which answers "which list is on screen", this
 * answers "where could a property at this path be declared". A schema may declare
 * one group inside `allOf` and the other inside `oneOf`/`anyOf`, so a reader that
 * picked a single group and stopped would never reach the other. `allOf` comes
 * first because its members are the stronger constraint — every one of them
 * applies — so a property both groups declare is attributed to the `allOf` one.
 */
export function getSubSchemaOptions<T>(
  schema: HasXxxOf<T> & { allOf?: T[] | undefined }
): T[] | undefined {
  const allOf = getAllOfOptions(schema);
  const xxxOf = getXxxOfOptions(schema)?.options;
  if (allOf === undefined) {
    return xxxOf;
  }
  return xxxOf === undefined ? allOf : [...allOf, ...xxxOf];
}
