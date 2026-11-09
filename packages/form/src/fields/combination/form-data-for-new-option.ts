// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/bb378bf1a5f144c51349fc587d076ccdc339943e/packages/core/src/components/fields/formDataForNewOption.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import {
  isSchemaObjectValue,
  isSchemaValueDeepEqual,
  PROPERTIES_KEY,
  type Schema,
  type SchemaObjectValue,
  type SchemaValue,
} from "#core/index.js";
import { declaresOwnValue, declaresValueFor } from "#form/declares-value.js";
import {
  getDefaultFieldState,
  retrieveSchema,
  sanitizeDataForNewSchema,
  type FormState,
} from "#form/index.js";
import { getOwn } from "#lib/object.js";

function propertySchema(option: Schema, key: string): Schema {
  const properties = getOwn(option, PROPERTIES_KEY);
  const property = properties && getOwn(properties, key);
  return typeof property === "object" ? property : {};
}

/**
 * Determines whether `option` declares a value of its own for `key`, either on
 * the property or in the option's own `default` object. The computed defaults
 * are no guide on their own: they also contain a nested object's leaf defaults,
 * `[]` for a required array and `false` for a required boolean, none of which
 * is the option saying what the key should hold.
 */
function optionDeclaresValueFor<T>(
  ctx: FormState<T>,
  option: Schema,
  key: string
) {
  return declaresValueFor(
    option,
    key,
    retrieveSchema(ctx, propertySchema(option, key), undefined)
  );
}

/** Computes `schema`'s defaults the same way the fill at the end of
 * `formDataForNewOption` does. */
function defaultsFor<T>(
  ctx: FormState<T>,
  schema: Schema | undefined
): SchemaValue | undefined {
  return schema
    ? getDefaultFieldState(ctx, {
        schema,
        formData: undefined,
        includeUndefinedValues: "excludeObjectChildren",
      })
    : undefined;
}

/**
 * Derives the form data for `newOption` from the data of `oldOption`.
 *
 * `sanitizeDataForNewSchema()` drops what the new option cannot hold, and
 * `getDefaultFieldState()` fills in what it declares, but neither lets the new
 * option's `default` reach a key that already holds something, so a value the
 * old option's default put there outlasts the switch and switching back does
 * not restore it (#4476). The same happens to a key whose value sanitize
 * discarded, because it clears by assigning `undefined` and the fill leaves an
 * explicitly set `undefined` alone. Deleting either kind of key outright is
 * what lets the fill below reach it.
 *
 * Both options must be the rendered variants from `getRenderedOptionSchema`,
 * so keywords inherited from the parent schema, especially `required`, are
 * already present when their defaults are computed. The rendered variants also
 * carry inherited keywords such as the parent's `type`, which matches how the
 * rest of the form computes defaults for the same option.
 */
export function formDataForNewOption<T>(
  ctx: FormState<T>,
  formData: SchemaValue | undefined,
  newOption: Schema | undefined,
  oldOption: Schema | undefined
): SchemaValue | undefined {
  let newFormData = sanitizeDataForNewSchema(
    ctx,
    newOption ?? {},
    oldOption ?? {},
    formData
  );
  if (!newOption) {
    return newFormData;
  }
  // Computes the old option's defaults at most once, and only for a key that
  // has got far enough to need them.
  let oldDefaults: SchemaValue | undefined;
  let oldDefaultsComputed = false;
  const defaultsForOldOption = () => {
    if (!oldDefaultsComputed) {
      oldDefaults = defaultsFor(ctx, oldOption);
      oldDefaultsComputed = true;
    }
    return oldDefaults;
  };
  // Computes the new option's defaults at most once. Both the test of what the
  // fill can restore and the fill itself need them whenever nothing is carried
  // over, and they are the same computation.
  let newDefaults: SchemaValue | undefined;
  let newDefaultsComputed = false;
  const defaultsForNewOption = () => {
    if (!newDefaultsComputed) {
      newDefaults = defaultsFor(ctx, newOption);
      newDefaultsComputed = true;
    }
    return newDefaults;
  };
  if (isSchemaObjectValue(newFormData)) {
    const sanitizedData = newFormData;
    const oldData: SchemaObjectValue = isSchemaObjectValue(formData)
      ? formData
      : {};
    let newDefaultsData: SchemaObjectValue | undefined;
    // Reports whether `key` still holds the value the old option would have put
    // there. Staleness is judged against `formData` as it arrived, not against
    // the sanitized copy: sanitize rewrites a nested value whenever the options
    // declare different properties for it, so the rewritten value no longer
    // resembles the default it came from. Values are matched whole, per
    // top-level key: editing one leaf of a nested object leaves the whole
    // subtree in place, so its other leaves keep the old option's defaults.
    const holdsOldDefault = (key: string) => {
      if (!oldOption || !optionDeclaresValueFor(ctx, oldOption, key)) {
        return false;
      }
      const computed = defaultsForOldOption();
      return (
        isSchemaObjectValue(computed) &&
        Object.hasOwn(computed, key) &&
        isSchemaValueDeepEqual(computed[key], oldData[key])
      );
    };
    let withoutBlockedKeys: SchemaObjectValue | undefined;
    const keys = Object.keys(sanitizedData);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!;
      // A key that did not carry a value over has nothing stale in it, and
      // emptying it further would rob `Form` of the all-`undefined` payload it
      // reads as a switch away from a `null` option.
      if (!Object.hasOwn(oldData, key) || oldData[key] === undefined) {
        continue;
      }
      if (newDefaultsData === undefined) {
        const optionDefaults = defaultsForNewOption();
        newDefaultsData = isSchemaObjectValue(optionDefaults)
          ? optionDefaults
          : {};
      }
      // The new option must declare a value for the key, and its computed
      // defaults must hold something, so the fill is certain to put a value
      // back. What an option declares and what the fill acts on are not the
      // same set: a `default` reached through `allOf` or `if`/`then` resolves
      // here but is not filled, and a `const` is skipped entirely under
      // `constAsDefaults: "never"`. Deleting on the declaration alone would
      // empty those keys for good.
      if (
        !Object.hasOwn(newDefaultsData, key) ||
        newDefaultsData[key] === undefined ||
        !optionDeclaresValueFor(ctx, newOption, key)
      ) {
        continue;
      }
      // Sanitize discarded the value, or the old option declares one and the
      // key still holds it. Only the second test needs the old option's
      // declaration: a value sanitize threw away is gone no matter who
      // declared it, and leaving the key holding `undefined` only blocks the
      // fill.
      if (sanitizedData[key] !== undefined && !holdsOldDefault(key)) {
        continue;
      }
      withoutBlockedKeys ??= { ...sanitizedData };
      delete withoutBlockedKeys[key];
    }
    if (withoutBlockedKeys !== undefined) {
      newFormData = withoutBlockedKeys;
    }
  } else if (
    // An option that is not an object declares its value on the option itself,
    // so the same rules apply to the whole value rather than per key. In
    // practice that means an array: sanitize carries nothing else across, so a
    // switch between two options of any other type arrives here already cleared
    // and is refilled below. The value has to stop matching more often than the
    // fill has nothing to write, so it is tested first.
    newFormData !== undefined &&
    oldOption &&
    declaresOwnValue(newOption) &&
    declaresOwnValue(oldOption) &&
    isSchemaValueDeepEqual(defaultsForOldOption(), formData) &&
    defaultsForNewOption() !== undefined
  ) {
    newFormData = undefined;
  }
  // Fill defaults on change. `excludeObjectChildren` creates only the root
  // objects themselves without adding `undefined` children. With nothing
  // carried over this is the same call the new option's defaults came from, so
  // reuse those.
  return newFormData === undefined
    ? defaultsForNewOption()
    : getDefaultFieldState(ctx, {
        schema: newOption,
        formData: newFormData,
        includeUndefinedValues: "excludeObjectChildren",
      });
}
