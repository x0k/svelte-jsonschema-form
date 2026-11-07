/**
 * Tracks the values a stale-defaults pass drops across the sanitize loop.
 *
 * Dropping a value is only half of the replacement: the defaults fill has to
 * write the new branch's value, the sanitize that follows has to be kept from
 * clearing it when the branch changed the key's type, and a value no fill
 * answered has to go back before the schema is resolved for the next
 * iteration. Those decisions need the dropped paths, the values they held, and
 * the schema each was written under, which the plain `dropStaleDefaults()`
 * hook does not return. This class keeps that state and owns the small
 * path-level helpers the loop needs.
 */

import {
  getSchemaDefinitionByPath,
  isSchemaObjectValue,
  retrieveSchema,
  sanitizeDataForNewSchema,
  type Merger,
  type RPath,
  type Schema,
  type SchemaValue,
  type Validator,
} from "#core/index.js";
import { getOwn, isRecord, setOwn } from "#lib/object.js";

import { pathKey } from "./change-path.js";
import { replaceAtPath } from "./drop-stale-defaults.js";
import type { FieldPath } from "./id.js";
import type { FormMerger, FormValueChange } from "./merger.js";
import type { FieldValue, FormValue } from "./model.js";

interface DroppedValue {
  path: FieldPath;
  value: FieldValue;
  /**
   * The schema that described the key while it held `value`, which is what a
   * replacement the fill writes is judged against.
   */
  writtenUnder: Schema | undefined;
}

export interface AfterFillResult {
  formData: FormValue;
  /**
   * Whether a dropped path holds a value for the first time. The loop buys one
   * further iteration for it, because the fill that wrote the replacement ran
   * with the key absent and resolved the key's own conditionals against no
   * value.
   */
  hasNewRefill: boolean;
}

export interface StaleDefaultsPassOptions {
  validator: Validator;
  merger: FormMerger;
  rootSchema: Schema;
  changes: readonly FormValueChange[];
  /**
   * The form data the pending changes started from.
   */
  oldFormData: FormValue;
  /**
   * The schema resolved for `oldFormData`.
   */
  oldSchema: Schema | undefined;
}

function getAtPath(data: unknown, path: RPath): unknown {
  let node = data;
  for (const key of path) {
    if (Array.isArray(node)) {
      if (typeof key !== "number" || key < 0 || key >= node.length) {
        return undefined;
      }
      node = getOwn(node, key);
    } else if (isRecord(node)) {
      node = getOwn(node, key);
    } else {
      return undefined;
    }
  }
  return node;
}

function deleteAtPath(data: FormValue, path: FieldPath): FormValue {
  if (path.length === 0) {
    return undefined;
  }
  const parentPath = path.slice(0, -1) as unknown as FieldPath;
  const parent = parentPath.length === 0 ? data : getAtPath(data, parentPath);
  if (!isSchemaObjectValue(parent)) {
    return data;
  }
  const key = path[path.length - 1]!;
  const copy = { ...parent };
  Reflect.deleteProperty(copy, key);
  return parentPath.length === 0 ? copy : replaceAtPath(data, parentPath, copy);
}

/**
 * Puts `value` back at `path`, copying only the containers along the path.
 *
 * Nothing is written when `isMissing` says the value is already there, when
 * `value` has been cleared by a rejected refill, or when the parent the path
 * addresses is no longer an object. A re-added key is inserted where it sat in
 * the data the pass arrived with, so restoring one value does not reorder the
 * siblings the fill has produced.
 */
function putBackAt(
  data: FormValue,
  oldFormData: FormValue,
  path: FieldPath,
  value: FieldValue,
  isMissing: (held: FieldValue) => boolean
): FormValue {
  if (value === undefined) {
    return data;
  }
  const parentPath = path.slice(0, -1) as unknown as FieldPath;
  const parent = parentPath.length === 0 ? data : getAtPath(data, parentPath);
  if (!isSchemaObjectValue(parent)) {
    return data;
  }
  const key = path[path.length - 1]!;
  const held = getOwn(parent, key);
  if (held === value || !isMissing(held)) {
    return data;
  }
  if (Object.hasOwn(parent, key)) {
    return replaceAtPath(data, path, value);
  }
  const oldParent =
    parentPath.length === 0 ? oldFormData : getAtPath(oldFormData, parentPath);
  const arrivedOrder = isSchemaObjectValue(oldParent)
    ? Object.keys(oldParent)
    : [];
  const arrivedAt = arrivedOrder.indexOf(String(key));
  if (arrivedAt < 0) {
    return replaceAtPath(data, path, value);
  }
  const ordered: Record<string, unknown> = {};
  let written = false;
  for (const name of Object.keys(parent)) {
    if (!written && arrivedOrder.indexOf(name) > arrivedAt) {
      setOwn(ordered, String(key), value);
      written = true;
    }
    setOwn(ordered, name, getOwn(parent, name));
  }
  if (!written) {
    setOwn(ordered, String(key), value);
  }
  return parentPath.length === 0
    ? (ordered as unknown as FormValue)
    : replaceAtPath(data, parentPath, ordered as unknown as FormValue);
}

function resolveSchemaAt(
  validator: Validator,
  merger: Merger,
  rootSchema: Schema,
  newSchema: Schema,
  path: FieldPath,
  formData: FormValue
): Schema | undefined {
  const definition = getSchemaDefinitionByPath(
    validator,
    merger,
    rootSchema,
    newSchema,
    path,
    formData
  );
  if (typeof definition === "boolean") {
    return definition ? {} : undefined;
  }
  if (!isSchemaObjectValue(definition)) {
    return undefined;
  }
  return retrieveSchema(
    validator,
    merger,
    definition,
    rootSchema,
    getAtPath(formData, path) as SchemaValue | undefined
  );
}

function isRefillRejected(
  validator: Validator,
  merger: Merger,
  rootSchema: Schema,
  path: FieldPath,
  newSchema: Schema,
  oldSchema: Schema,
  value: FieldValue
): boolean {
  const key = String(path[path.length - 1]);
  const newProperties: Record<string, Schema> = {};
  const oldProperties: Record<string, Schema> = {};
  setOwn(newProperties, key, newSchema);
  setOwn(oldProperties, key, oldSchema);
  const data: Record<string, FieldValue> = {};
  setOwn(data, key, value);
  const judged = sanitizeDataForNewSchema(
    validator,
    merger,
    rootSchema,
    { properties: newProperties },
    { properties: oldProperties },
    data
  );
  return (
    !isSchemaObjectValue(judged) || !merger.isValueDeepEqual(judged[key], value)
  );
}

export class StaleDefaultsPass {
  private readonly dropped = new Map<string, DroppedValue>();
  private readonly settled = new Set<string>();
  private readonly validator: Validator;
  private readonly merger: FormMerger;
  private readonly rootSchema: Schema;
  private readonly changes: readonly FormValueChange[];
  private readonly oldFormData: FormValue;
  private readonly oldSchema: Schema | undefined;

  constructor({
    validator,
    merger,
    rootSchema,
    changes,
    oldFormData,
    oldSchema,
  }: StaleDefaultsPassOptions) {
    this.validator = validator;
    this.merger = merger;
    this.rootSchema = rootSchema;
    this.changes = changes;
    this.oldFormData = oldFormData;
    this.oldSchema = oldSchema;
  }

  /** Drops every stale path the search reports for `formData`. */
  drop(formData: FormValue, newSchema: Schema): FormValue {
    const result = this.merger.dropStaleDefaults({
      validator: this.validator,
      rootSchema: this.rootSchema,
      newSchema,
      formData,
      changes: this.changes,
      oldFormData: this.oldFormData,
      oldSchema: this.oldSchema,
      droppedPaths: [...this.dropped.values()].map(({ path }) => path),
    });
    if (!isSchemaObjectValue(result)) {
      return formData;
    }
    this.collectDrops(formData, result, newSchema);
    return result;
  }

  /**
   * Restores a dropped value no fill has answered, and reports the paths that
   * hold a replacement for the first time.
   */
  afterFill(formData: FormValue): AfterFillResult {
    let result = formData;
    let hasNewRefill = false;
    for (const [key, dropped] of this.dropped) {
      const held = getAtPath(result, dropped.path) as FieldValue;
      if (held !== undefined) {
        if (!this.settled.has(key)) {
          this.settled.add(key);
          hasNewRefill = true;
        }
      } else if (!this.settled.has(key)) {
        result = putBackAt(
          result,
          this.oldFormData,
          dropped.path,
          dropped.value,
          (value) => value === undefined
        );
      }
    }
    return { formData: result, hasNewRefill };
  }

  /**
   * Judges each replacement at its own key against the schema that describes it
   * now, and reinstates it whole where sanitize altered it. Sanitize compares
   * against the schema the data arrived under, so a swap that retyped the key
   * or a leaf inside it would otherwise clear the newly written default.
   */
  afterSanitize(
    formData: FormValue,
    dataBeforeSanitize: FormValue,
    newSchema: Schema
  ): FormValue {
    let result = formData;
    for (const [key, dropped] of this.dropped) {
      const held = getAtPath(dataBeforeSanitize, dropped.path) as FieldValue;
      if (held === undefined) {
        continue;
      }
      const resolvedNow = resolveSchemaAt(
        this.validator,
        this.merger,
        this.rootSchema,
        newSchema,
        dropped.path,
        dataBeforeSanitize
      );
      const writtenUnder = dropped.writtenUnder;
      const rejected =
        writtenUnder !== undefined &&
        resolvedNow !== undefined &&
        isRefillRejected(
          this.validator,
          this.merger,
          this.rootSchema,
          dropped.path,
          resolvedNow,
          writtenUnder,
          held
        );
      if (rejected) {
        this.dropped.set(key, {
          ...dropped,
          value: undefined,
          writtenUnder: resolvedNow,
        });
        result = deleteAtPath(result, dropped.path);
      } else {
        result = putBackAt(
          result,
          this.oldFormData,
          dropped.path,
          held,
          (value) => !this.merger.isValueDeepEqual(value, held)
        );
      }
    }
    return result;
  }

  /** Puts back every dropped value no fill ever answered. */
  restoreUnfilled(formData: FormValue): FormValue {
    let result = formData;
    for (const [key, dropped] of this.dropped) {
      if (!this.settled.has(key)) {
        result = putBackAt(
          result,
          this.oldFormData,
          dropped.path,
          dropped.value,
          (value) => value === undefined
        );
      }
    }
    return result;
  }

  private collectDrops(before: FormValue, after: FormValue, newSchema: Schema) {
    if (!isSchemaObjectValue(before) || !isSchemaObjectValue(after)) {
      return;
    }
    const walk = (
      oldLevel: Record<string, unknown>,
      newLevel: Record<string, unknown>,
      path: FieldPath
    ) => {
      for (const key of Object.keys(oldLevel)) {
        const nextPath = [...path, key] as unknown as FieldPath;
        if (!Object.hasOwn(newLevel, key)) {
          const keyId = pathKey(nextPath);
          if (!this.dropped.has(keyId)) {
            this.dropped.set(keyId, {
              path: nextPath,
              value: getOwn(oldLevel, key) as FieldValue,
              writtenUnder: resolveSchemaAt(
                this.validator,
                this.merger,
                this.rootSchema,
                newSchema,
                nextPath,
                before
              ),
            });
          }
        } else {
          const oldValue = getOwn(oldLevel, key);
          const newValue = getOwn(newLevel, key);
          if (isSchemaObjectValue(oldValue) && isSchemaObjectValue(newValue)) {
            walk(oldValue, newValue, nextPath);
          }
        }
      }
    };
    walk(before, after, [] as unknown as FieldPath);
  }
}
