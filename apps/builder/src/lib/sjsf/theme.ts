import type {
  ComponentProps,
  ComponentType,
  FieldCommonProps,
  UiOptions,
  UiSchema
} from "@sjsf/form";
import type { ToTheme, WidgetTypes } from "meta";
import type { PlaygroundTheme } from "meta/playground";

export type FieldType = {
  [T in ComponentType]: ComponentProps[T] extends FieldCommonProps<any> ? T : never;
}[ComponentType];

export type WidgetType = WidgetTypes[ToTheme<PlaygroundTheme>];

interface MergeArraysOptions<T> {
  merge?: (l: T, r: T) => T;
  /**
   * @default false
   */
  unique?: boolean;
}

function mergeArrays<T>(left: T[], right: T[], { merge, unique }: MergeArraysOptions<T> = {}) {
  let merged: T[];
  if (merge) {
    const [minArr, maxArr] = left.length <= right.length ? [left, right] : [right, left];
    merged = new Array(maxArr.length);
    for (let i = 0; i < minArr.length; i++) {
      merged[i] = merge(left[i]!, right[i]!);
    }
    for (let i = minArr.length; i < maxArr.length; i++) {
      merged[i] = maxArr[i]!;
    }
  } else {
    merged = left.concat(right);
  }
  return unique ? Array.from(new Set(merged)) : merged;
}

function mergeUiSchemaItems(
  lItems: NonNullable<UiSchema["items"]>,
  rItems: NonNullable<UiSchema["items"]>
): UiSchema["items"] {
  const isRArray = Array.isArray(rItems);
  if (Array.isArray(lItems) !== isRArray) {
    return rItems;
  }
  if (isRArray) {
    return mergeArrays(lItems as UiSchema[], rItems as UiSchema[], {
      merge: mergeUiSchemas
    });
  }
  return mergeUiSchemas(lItems as UiSchema, rItems as UiSchema);
}

const COMMON_NESTED_KEYS = ["layouts", "buttons"] as const satisfies (keyof UiOptions)[];

export function mergeUiSchemas(left: UiSchema, right: UiSchema): UiSchema {
  const merged = Object.assign({}, left, right);
  const commonKeys = new Set(Object.keys(left)).intersection(new Set(Object.keys(right)));
  for (const key of commonKeys) {
    const l = left[key];
    const r = right[key];
    if (key === "ui:options" || key === "ui:components" || key === "ui:globalOptions") {
      //@ts-expect-error
      merged[key] = Object.assign({}, l, r);
      for (const k of COMMON_NESTED_KEYS) {
        if (l && r && k in l && k in r) {
          //@ts-expect-error
          merged[key][k] = Object.assign({}, l[k], r[k]);
        }
      }
    } else if (key === "items") {
      merged["items"] = mergeUiSchemaItems(l as UiSchema[], r as UiSchema[]);
    } else if (key === "anyOf" || key === "oneOf") {
      merged[key] = mergeArrays(l as UiSchema[], r as UiSchema[], {
        merge: mergeUiSchemas
      });
    } else {
      merged[key] = mergeUiSchemas(l as UiSchema, r as UiSchema);
    }
  }
  return merged;
}
