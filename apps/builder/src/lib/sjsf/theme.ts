import type {
  ComponentProps,
  ComponentType,
  FieldCommonProps,
  Theme as SJSFTheme,
  UiOptions,
  UiSchema,
} from "@sjsf/form";
import type { WidgetCommonProps } from "@sjsf/form/fields/widgets";

import "@sjsf/form/fields/extra/boolean-select-include";
import "@sjsf/form/fields/extra/enum-include";
import "@sjsf/form/fields/extra/file-include";
import "@sjsf/form/fields/extra/multi-enum-include";
import "@sjsf/form/fields/extra/unknown-native-file-include";
import "@sjsf/form/fields/extra/array-native-files-include";
import "@sjsf/form/fields/extra/array-files-include";
import "@sjsf/form/fields/extra/array-tags-include";

import { theme as basic } from "@sjsf/basic-theme";
import basicStyles from "@sjsf/basic-theme/css/basic.css?raw";
import picoStyles from "@picocss/pico/css/pico.css?raw";
import picoAdapterStyles from "@sjsf/basic-theme/css/pico.css?raw";
import "@sjsf/basic-theme/extra-widgets/checkboxes-include";
import "@sjsf/basic-theme/extra-widgets/date-picker-include";
import "@sjsf/basic-theme/extra-widgets/file-include";
import "@sjsf/basic-theme/extra-widgets/multi-select-include";
import "@sjsf/basic-theme/extra-widgets/radio-include";
import "@sjsf/basic-theme/extra-widgets/range-include";
import "@sjsf/basic-theme/extra-widgets/textarea-include";

import { theme as daisy5 } from "@sjsf/daisyui5-theme";
import { default as daisy5Styles } from "@sjsf/daisyui5-theme/styles.css?raw";

import "@sjsf/daisyui5-theme/extra-widgets/checkboxes-include";
import "@sjsf/daisyui5-theme/extra-widgets/date-picker-include";
import "@sjsf/daisyui5-theme/extra-widgets/file-include";
import "@sjsf/daisyui5-theme/extra-widgets/multi-select-include";
import "@sjsf/daisyui5-theme/extra-widgets/radio-buttons-include";
import "@sjsf/daisyui5-theme/extra-widgets/radio-include";
import "@sjsf/daisyui5-theme/extra-widgets/range-include";
import "@sjsf/daisyui5-theme/extra-widgets/rating-include";
import "@sjsf/daisyui5-theme/extra-widgets/switch-include";
import "@sjsf/daisyui5-theme/extra-widgets/textarea-include";
import "@sjsf/daisyui5-theme/extra-widgets/cally-date-picker-include";
import "@sjsf/daisyui5-theme/extra-widgets/filter-radio-buttons-include";

import { theme as flowbite3 } from "@sjsf/flowbite3-theme";
import { default as flowbite3Styles } from "@sjsf/flowbite3-theme/styles.css?raw";
import "@sjsf/flowbite3-theme/extra-widgets/checkboxes-include";
import "@sjsf/flowbite3-theme/extra-widgets/date-picker-include";
import "@sjsf/flowbite3-theme/extra-widgets/file-include";
import "@sjsf/flowbite3-theme/extra-widgets/multi-select-include";
import "@sjsf/flowbite3-theme/extra-widgets/radio-buttons-include";
import "@sjsf/flowbite3-theme/extra-widgets/radio-include";
import "@sjsf/flowbite3-theme/extra-widgets/range-include";
import "@sjsf/flowbite3-theme/extra-widgets/switch-include";
import "@sjsf/flowbite3-theme/extra-widgets/tags-include";
import "@sjsf/flowbite3-theme/extra-widgets/textarea-include";
import "@sjsf/flowbite3-theme/extra-widgets/toggle-radio-buttons-include";

import { theme as skeleton4 } from "@sjsf/skeleton4-theme";
import { default as skeleton4Styles } from "@sjsf/skeleton4-theme/styles.css?raw";
import "@sjsf/skeleton4-theme/extra-widgets/checkboxes-include";
import "@sjsf/skeleton4-theme/extra-widgets/date-picker-include";
import "@sjsf/skeleton4-theme/extra-widgets/file-include";
import "@sjsf/skeleton4-theme/extra-widgets/multi-select-include";
import "@sjsf/skeleton4-theme/extra-widgets/radio-buttons-include";
import "@sjsf/skeleton4-theme/extra-widgets/radio-include";
import "@sjsf/skeleton4-theme/extra-widgets/range-include";
import "@sjsf/skeleton4-theme/extra-widgets/rating-include";
import "@sjsf/skeleton4-theme/extra-widgets/switch-include";
import "@sjsf/skeleton4-theme/extra-widgets/tags-include";
import "@sjsf/skeleton4-theme/extra-widgets/textarea-include";
import "@sjsf/skeleton4-theme/extra-widgets/combobox-include";
import "@sjsf/skeleton4-theme/extra-widgets/file-upload-include";
import "@sjsf/skeleton4-theme/extra-widgets/slider-include";

import { theme as shadcn4 } from "@sjsf/shadcn4-theme";
import { default as shadcn4Styles } from "@sjsf/shadcn4-theme/styles.css?raw";
import "@sjsf/shadcn4-theme/extra-widgets/checkboxes-include";
import "@sjsf/shadcn4-theme/extra-widgets/combobox-include";
import "@sjsf/shadcn4-theme/extra-widgets/date-picker-include";
import "@sjsf/shadcn4-theme/extra-widgets/file-include";
import "@sjsf/shadcn4-theme/extra-widgets/multi-select-include";
import "@sjsf/shadcn4-theme/extra-widgets/radio-buttons-include";
import "@sjsf/shadcn4-theme/extra-widgets/radio-include";
import "@sjsf/shadcn4-theme/extra-widgets/range-include";
import "@sjsf/shadcn4-theme/extra-widgets/switch-include";
import "@sjsf/shadcn4-theme/extra-widgets/textarea-include";

import { theme as svar } from "@sjsf-lab/svar-theme";
import "@sjsf-lab/svar-theme/extra-widgets/checkboxes-include";
import "@sjsf-lab/svar-theme/extra-widgets/date-picker-include";
import "@sjsf-lab/svar-theme/extra-widgets/multi-select-include";
import "@sjsf-lab/svar-theme/extra-widgets/radio-include";
import "@sjsf-lab/svar-theme/extra-widgets/range-include";
import "@sjsf-lab/svar-theme/extra-widgets/textarea-include";

export type FieldType = {
  [T in ComponentType]: ComponentProps[T] extends FieldCommonProps<any>
    ? T
    : never;
}[ComponentType];

export type WidgetType = {
  [T in ComponentType]: ComponentProps[T] extends WidgetCommonProps<any>
    ? T
    : never;
}[ComponentType];

export enum ActualTheme {
  Basic = "basic",
  Pico = "pico",
  Daisy5 = "daisyui5",
  Flowbite3 = "flowbite3",
  Skeleton4 = "skeleton4",
  Shadcn4 = "shadcn4",
}

const ACTUAL_THEMES = Object.values(ActualTheme);

export enum LabTheme {
  Svar = "svar",
}

const LAB_THEMES = Object.values(LabTheme);
const LAB_THEMES_SET = new Set<Theme>(LAB_THEMES);

function isLabTheme(theme: Theme): theme is LabTheme {
  return LAB_THEMES_SET.has(theme);
}

export type Theme = ActualTheme | LabTheme;

export const THEMES = [...ACTUAL_THEMES, ...LAB_THEMES];

export function packageFromTheme(theme: Theme): string {
  return `@sjsf${isLabTheme(theme) ? '-lab' : ''}/${theme}-theme`
}

export const THEME_TITLES: Record<Theme, string> = {
  [ActualTheme.Basic]: "Basic",
  [ActualTheme.Pico]: "Pico",
  [ActualTheme.Daisy5]: "daisyUI v5",
  [ActualTheme.Flowbite3]: "Flowbite Svelte",
  [ActualTheme.Skeleton4]: "Skeleton v4",
  [ActualTheme.Shadcn4]: "shadcn-svelte",
  [LabTheme.Svar]: "SVAR",
};

export const THEME_OPTIONAL_DEPS: Record<
  Theme,
  Record<string, Set<WidgetType>>
> = {
  [ActualTheme.Basic]: {},
  [ActualTheme.Pico]: {},
  [ActualTheme.Daisy5]: {},
  [ActualTheme.Flowbite3]: {},
  [ActualTheme.Skeleton4]: {
    "@skeletonlabs/skeleton-svelte": new Set([
      "skeleton4FileUploadWidget",
      "skeleton4SliderWidget",
      "radioButtonsWidget",
      "comboboxWidget",
      "ratingWidget",
      "rangeWidget",
      "switchWidget",
      "tagsWidget",
    ]),
  },
  [ActualTheme.Shadcn4]: {
    "@internationalized/date": new Set(["datePickerWidget"]),
  },
  [LabTheme.Svar]: {},
};

export const THEME_PEER_DEPS: Record<Theme, string> = {
  [ActualTheme.Basic]: "",
  [ActualTheme.Pico]: "@picocss/pico",
  [ActualTheme.Daisy5]: "daisyui",
  [ActualTheme.Flowbite3]: "flowbite flowbite-svelte",
  [ActualTheme.Skeleton4]: "@skeletonlabs/skeleton @tailwindcss/forms",
  [ActualTheme.Shadcn4]:
    "@lucide/svelte bits-ui clsx tailwind-merge tailwind-variants",
  [LabTheme.Svar]: "@svar-ui/svelte-core",
};

export const SJSF_THEMES: Record<Theme, SJSFTheme> = {
  [ActualTheme.Basic]: basic,
  [ActualTheme.Pico]: basic,
  [ActualTheme.Daisy5]: daisy5,
  [ActualTheme.Flowbite3]: flowbite3,
  [ActualTheme.Skeleton4]: skeleton4,
  [ActualTheme.Shadcn4]: shadcn4,
  [LabTheme.Svar]: svar,
};

export const THEME_STYLES: Record<Theme, string> = {
  [ActualTheme.Basic]: basicStyles,
  [ActualTheme.Pico]: `${picoStyles}\n${picoAdapterStyles}`,
  [ActualTheme.Daisy5]: daisy5Styles,
  [ActualTheme.Flowbite3]: flowbite3Styles,
  [ActualTheme.Skeleton4]: skeleton4Styles,
  [ActualTheme.Shadcn4]: shadcn4Styles,
  [LabTheme.Svar]: "",
};

interface MergeArraysOptions<T> {
  merge?: (l: T, r: T) => T;
  /**
   * @default false
   */
  unique?: boolean;
}

function mergeArrays<T>(
  left: T[],
  right: T[],
  { merge, unique }: MergeArraysOptions<T> = {}
) {
  let merged: T[];
  if (merge) {
    const [minArr, maxArr] =
      left.length <= right.length ? [left, right] : [right, left];
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
      merge: mergeUiSchemas,
    });
  }
  return mergeUiSchemas(lItems as UiSchema, rItems as UiSchema);
}

const COMMON_NESTED_KEYS = [
  "layouts",
  "buttons",
] as const satisfies (keyof UiOptions)[];

export function mergeUiSchemas(left: UiSchema, right: UiSchema): UiSchema {
  const merged = Object.assign({}, left, right);
  const commonKeys = new Set(Object.keys(left)).intersection(
    new Set(Object.keys(right))
  );
  for (const key of commonKeys) {
    const l = left[key];
    const r = right[key];
    if (
      key === "ui:options" ||
      key === "ui:components" ||
      key === "ui:globalOptions"
    ) {
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
        merge: mergeUiSchemas,
      });
    } else {
      merged[key] = mergeUiSchemas(l as UiSchema, r as UiSchema);
    }
  }
  return merged;
}
