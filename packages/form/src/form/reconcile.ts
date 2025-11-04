import { isRecordProto } from "@/lib/object.js";
import type { SchemaValue } from "@/core/index.js";

import type { FieldValue, KeyedArraysMap } from "./model.js";

export const UNCHANGED = Symbol("unchanged");

export function createSchemaValuesReconciler(keyedArraysMap: KeyedArraysMap) {
  return function reconcile(
    target: SchemaValue | undefined,
    source: SchemaValue | undefined
  ): SchemaValue | undefined | typeof UNCHANGED {
    if (target === source) {
      return UNCHANGED;
    }
    if (typeof target === "object" && typeof source === "object") {
      const isTArr = Array.isArray(target);
      const isSArr = Array.isArray(source);
      if (isTArr && isSArr) {
        const l = Math.min(target.length, source.length);
        let i = 0;
        for (; i < l; i++) {
          const v = reconcile(target[i], source[i]);
          if (v !== UNCHANGED) {
            target[i] = v;
          }
        }
        if (target.length !== source.length) {
          const keyed = keyedArraysMap.get(target) ?? target;
          for (; i < source.length; i++) {
            keyed.push(source[i]);
          }
          keyed.splice(source.length);
        }
        return UNCHANGED;
      }
      if (
        !isTArr &&
        !isSArr &&
        target !== null &&
        source !== null &&
        isRecordProto<FieldValue>(target) &&
        isRecordProto<FieldValue>(source)
      ) {
        const tKeys = Object.keys(target);
        let l = tKeys.length;
        for (let i = 0; i < l; i++) {
          const key = tKeys[i]!;
          if (!(key in source)) {
            delete target[key];
          }
        }
        const sKeys = Object.keys(source);
        l = sKeys.length;
        for (let i = 0; i < l; i++) {
          const key = sKeys[i]!;
          const v = reconcile(target[key], source[key]);
          if (v !== UNCHANGED) {
            target[key] = v;
          }
        }
        return UNCHANGED;
      }
    }
    return source;
  };
}
