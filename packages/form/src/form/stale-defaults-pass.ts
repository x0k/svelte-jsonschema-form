/**
 * Tracks the values a stale-defaults pass drops across the sanitize loop.
 *
 * Dropping a value is only half of the replacement: the defaults fill has to
 * write the new branch's value, the sanitize that follows has to be kept from
 * clearing it when the branch changed the key's type, and a value no fill
 * answered has to go back before the schema is resolved for the next
 * iteration. Those decisions need the dropped paths, the values they held, and
 * the schema each was written under, which `dropStaleDefaults()` reports as
 * entries. This class keeps that state and owns the small path-level helpers
 * the loop needs.
 */

import {
  createCoreContext,
  getSchemaDefinitionByPath,
  isSchemaArrayValue,
  isSchemaObjectValue,
  isValueDeepEqual,
  retrieveSchema,
  sanitizeDataForNewSchema,
  type CoreContext,
  type RPath,
  type Schema,
  type Validator,
} from "#core/index.js";
import { getOwn, getValueByPath, setOwn } from "#lib/object.js";

import { deleteAtPath, replaceAtPath } from "./drop-stale-defaults.js";
import type { FieldPath } from "./id.js";
import type { DroppedDefault, FormMerger, FormValueChange } from "./merger.js";
import type { FieldValue, FormValue } from "./model.js";

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
   * Returns the form's canonical child path, so dropped paths are compared by
   * identity.
   */
  getChildPath: (parentPath: RPath, key: string | number) => FieldPath;
  /**
   * The form data the pending changes started from.
   */
  oldFormData: FormValue;
  /**
   * The schema resolved for `oldFormData`.
   */
  oldSchema: Schema | undefined;
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
  path: RPath,
  value: FieldValue,
  isMissing: (held: FieldValue) => boolean
): FormValue {
  if (value === undefined) {
    return data;
  }
  const parentPath = path.slice(0, -1);
  const parent =
    parentPath.length === 0
      ? data
      : getValueByPath<FormValue, FieldValue>(data, parentPath);
  if (!isSchemaObjectValue(parent)) {
    return data;
  }
  const key = path[path.length - 1]!;
  if (typeof key !== "string") {
    throw new Error("Cannot write a non-string key to an object");
  }
  const held = getOwn(parent, key);
  if (held === value || !isMissing(held)) {
    return data;
  }
  if (Object.hasOwn(parent, key)) {
    return replaceAtPath(data, path, value);
  }
  const oldParent =
    parentPath.length === 0
      ? oldFormData
      : getValueByPath<FormValue, FieldValue>(oldFormData, parentPath);
  const arrivedOrder = isSchemaObjectValue(oldParent)
    ? Object.keys(oldParent)
    : [];
  const arrivedAt = arrivedOrder.indexOf(key);
  if (arrivedAt < 0) {
    return replaceAtPath(data, path, value);
  }
  const ordered: Record<string, FieldValue> = {};
  let written = false;
  for (const name of Object.keys(parent)) {
    if (!written && arrivedOrder.indexOf(name) > arrivedAt) {
      setOwn(ordered, key, value);
      written = true;
    }
    setOwn(ordered, name, getOwn(parent, name));
  }
  if (!written) {
    setOwn(ordered, key, value);
  }
  return parentPath.length === 0
    ? ordered
    : replaceAtPath(data, parentPath, ordered);
}

function resolveSchemaAt(
  ctx: CoreContext,
  newSchema: Schema,
  path: RPath,
  formData: FormValue
): Schema | undefined {
  let fieldSchema: Schema = newSchema;
  let fieldData: FormValue = formData;
  for (const segment of path) {
    const childSchema = getSchemaDefinitionByPath(
      ctx,
      fieldSchema,
      [segment],
      fieldData
    );
    // A boolean `true` schema describes anything, but it is not a schema the
    // refill can be judged against; RJSF leaves such a key unjudged too.
    if (!isSchemaObjectValue(childSchema)) {
      return undefined;
    }
    fieldData = isSchemaArrayValue(fieldData)
      ? typeof segment === "number"
        ? fieldData[segment]
        : undefined
      : isSchemaObjectValue(fieldData)
        ? typeof segment === "string"
          ? getOwn(fieldData, segment)
          : undefined
        : undefined;
    // Resolve at each level, not only at the leaf: a swap decided inside a
    // property leaves the root retrieved schema the same object, so the child
    // declaration has to be retrieved against the data at its own level.
    fieldSchema = retrieveSchema(ctx, childSchema, fieldData);
  }
  return fieldSchema;
}

function isRefillRejected(
  ctx: CoreContext,
  path: RPath,
  newSchema: Schema,
  oldSchema: Schema,
  value: FieldValue
): boolean {
  const key = path[path.length - 1]!;
  if (typeof key !== "string") {
    throw new Error("Cannot judge a non-string key as an object property");
  }
  const newProperties: Record<string, Schema> = {};
  const oldProperties: Record<string, Schema> = {};
  setOwn(newProperties, key, newSchema);
  setOwn(oldProperties, key, oldSchema);
  const data: Record<string, FieldValue> = {};
  setOwn(data, key, value);
  const judged = sanitizeDataForNewSchema(
    ctx,
    { properties: newProperties },
    { properties: oldProperties },
    data
  );
  return (
    !isSchemaObjectValue(judged) || !isValueDeepEqual(ctx, judged[key], value)
  );
}

export class StaleDefaultsPass {
  private readonly dropped = new Map<FieldPath, DroppedDefault>();
  private readonly droppedPathKeys = new Set<FieldPath>();
  private readonly settled = new Set<FieldPath>();
  private readonly ctx: CoreContext;
  private readonly validator: Validator;
  private readonly merger: FormMerger;
  private readonly rootSchema: Schema;
  private readonly changes: readonly FormValueChange[];
  private readonly getChildPath: (
    parentPath: RPath,
    key: string | number
  ) => FieldPath;
  private readonly oldFormData: FormValue;
  private readonly oldSchema: Schema | undefined;

  constructor({
    validator,
    merger,
    rootSchema,
    changes,
    getChildPath,
    oldFormData,
    oldSchema,
  }: StaleDefaultsPassOptions) {
    this.ctx = createCoreContext({ validator, merger, rootSchema });
    this.validator = validator;
    this.merger = merger;
    this.rootSchema = rootSchema;
    this.changes = changes;
    this.getChildPath = getChildPath;
    this.oldFormData = oldFormData;
    this.oldSchema = oldSchema;
  }

  /** Drops every stale path the search reports for `formData`. */
  drop(
    formData: FormValue,
    newSchema: Schema,
    initialDefaultsGenerated: boolean
  ): FormValue {
    const { formData: result, dropped } = this.merger.dropStaleDefaults({
      validator: this.validator,
      rootSchema: this.rootSchema,
      newSchema,
      formData,
      changes: this.changes,
      oldFormData: this.oldFormData,
      oldSchema: this.oldSchema,
      droppedPaths: this.droppedPathKeys,
      getChildPath: this.getChildPath,
      initialDefaultsGenerated,
    });
    for (const entry of dropped) {
      this.recordDrop(entry);
    }
    return isSchemaObjectValue(result) ? result : formData;
  }

  /**
   * Restores a dropped value no fill has answered, and reports the paths that
   * hold a replacement for the first time.
   */
  afterFill(formData: FormValue): AfterFillResult {
    let result = formData;
    let hasNewRefill = false;
    for (const [key, dropped] of this.dropped) {
      const held = getValueByPath<FormValue, FieldValue>(result, dropped.path);
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
      const held = getValueByPath<FormValue, FieldValue>(
        dataBeforeSanitize,
        dropped.path
      );
      if (held === undefined) {
        continue;
      }
      const resolvedNow = resolveSchemaAt(
        this.ctx,
        newSchema,
        dropped.path,
        dataBeforeSanitize
      );
      const writtenUnder = dropped.writtenUnder;
      const rejected =
        writtenUnder !== undefined &&
        resolvedNow !== undefined &&
        isRefillRejected(
          this.ctx,
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
        // The schema that accepted this refill is the one a later movement has
        // to judge it against, not the schema it was dropped under.
        this.dropped.set(key, {
          ...dropped,
          writtenUnder: resolvedNow ?? writtenUnder,
        });
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

  private recordDrop(dropped: DroppedDefault) {
    const path = dropped.path;
    if (!this.dropped.has(path)) {
      this.dropped.set(path, dropped);
      this.droppedPathKeys.add(path);
    }
  }
}
