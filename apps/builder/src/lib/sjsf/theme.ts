import { extendByRecord } from "@sjsf/form/lib/resolver";
import type {
  ComponentType,
  SchemaValue,
  Theme as SJSFTheme,
  UiSchema,
} from "@sjsf/form";
import type { Options, WidgetCommonProps } from "@sjsf/form/fields/widgets";

import "@sjsf/form/fields/extra-fields/boolean-select-include";
import "@sjsf/form/fields/extra-fields/enum-include";
import "@sjsf/form/fields/extra-fields/file-include";
import "@sjsf/form/fields/extra-fields/files-include";
import "@sjsf/form/fields/extra-fields/multi-enum-include";
import "@sjsf/form/fields/extra-fields/tags-include";

import { theme as basic } from "@sjsf/basic-theme";
import "@sjsf/basic-theme/extra-widgets/checkboxes-include";
import "@sjsf/basic-theme/extra-widgets/date-picker-include";
import "@sjsf/basic-theme/extra-widgets/file-include";
import "@sjsf/basic-theme/extra-widgets/multi-select-include";
import "@sjsf/basic-theme/extra-widgets/radio-include";
import "@sjsf/basic-theme/extra-widgets/range-include";
import "@sjsf/basic-theme/extra-widgets/textarea-include";

import { theme as daisy5base } from "@sjsf/daisyui5-theme";
import { default as daisy5Styles } from "@sjsf/daisyui5-theme/styles.css?raw";

import "@sjsf/daisyui5-theme/extra-widgets/cally-date-picker-include";
import "@sjsf/daisyui5-theme/extra-widgets/checkboxes-include";
import "@sjsf/daisyui5-theme/extra-widgets/file-include";
import "@sjsf/daisyui5-theme/extra-widgets/multi-select-include";
import "@sjsf/daisyui5-theme/extra-widgets/radio-buttons-include";
import "@sjsf/daisyui5-theme/extra-widgets/radio-include";
import "@sjsf/daisyui5-theme/extra-widgets/range-include";
import "@sjsf/daisyui5-theme/extra-widgets/rating-include";
import "@sjsf/daisyui5-theme/extra-widgets/switch-include";
import "@sjsf/daisyui5-theme/extra-widgets/textarea-include";
import FilterRadioButtons from "@sjsf/daisyui5-theme/extra-widgets/filter-radio-buttons.svelte";
import PikadayDatePicker from "@sjsf/daisyui5-theme/extra-widgets/pikaday-date-picker.svelte";

declare module "@sjsf/form" {
  interface ComponentProps {
    filterRadioButtonsWidget: WidgetCommonProps<SchemaValue> & Options;
    pikadayDatePickerWidget: WidgetCommonProps<string>;
  }
  interface ComponentBinding {
    filterRadioButtonsWidget: "value";
    pikadayDatePickerWidget: "value";
  }
}

const daisy5 = extendByRecord(daisy5base, {
  filterRadioButtonsWidget: FilterRadioButtons,
  pikadayDatePickerWidget: PikadayDatePicker,
});

const daisyui5conflicts: ComponentType[][] = [
  ["radioButtonsWidget", "filterRadioButtonsWidget"],
  ["datePickerWidget", "pikadayDatePickerWidget"],
];

import { theme as flowbite3 } from "@sjsf/flowbite3-theme";
import { default as flowbite3Styles } from "@sjsf/flowbite3-theme/styles.css?inline";
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

import { theme as skeleton3base } from "@sjsf/skeleton3-theme";
import { default as skeleton3Styles } from "@sjsf/skeleton3-theme/styles.css?inline";
import "@sjsf/skeleton3-theme/extra-widgets/checkboxes-include";
import "@sjsf/skeleton3-theme/extra-widgets/date-picker-include";
import "@sjsf/skeleton3-theme/extra-widgets/file-include";
import "@sjsf/skeleton3-theme/extra-widgets/multi-select-include";
import "@sjsf/skeleton3-theme/extra-widgets/radio-buttons-include";
import "@sjsf/skeleton3-theme/extra-widgets/radio-include";
import "@sjsf/skeleton3-theme/extra-widgets/range-include";
import "@sjsf/skeleton3-theme/extra-widgets/rating-include";
import "@sjsf/skeleton3-theme/extra-widgets/switch-include";
import "@sjsf/skeleton3-theme/extra-widgets/tags-include";
import "@sjsf/skeleton3-theme/extra-widgets/textarea-include";
import FileUpload from "@sjsf/skeleton3-theme/extra-widgets/file-upload.svelte";
import Slider from "@sjsf/skeleton3-theme/extra-widgets/slider.svelte";

declare module "@sjsf/form" {
  interface ComponentProps {
    fileUploadWidget: WidgetCommonProps<FileList> & {
      multiple: boolean;
      loading: boolean;
      processing: boolean;
    };
    sliderWidget: WidgetCommonProps<number>;
  }
  interface ComponentBindings {
    fileUploadWidget: "value";
    sliderWidget: "value";
  }
}

const skeleton3 = extendByRecord(skeleton3base, {
  fileUploadWidget: FileUpload,
  sliderWidget: Slider,
});

const skeleton3conflicts: ComponentType[][] = [
  ["fileWidget", "fileUploadWidget"],
  ["rangeWidget", "sliderWidget"],
];

import { theme as shadcn4 } from "@sjsf/shadcn4-theme";
import { default as shadcn4Styles } from "@sjsf/shadcn4-theme/styles.css?inline";
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

export enum Theme {
  Basic = "basic",
  Daisy5 = "daisy5",
  Flowbite3 = "flowbite3",
  Skeleton3 = "skeleton3",
  Shadcn4 = "shadcn4",
}

export const THEMES = Object.values(Theme);

export const THEME_TITLES: Record<Theme, string> = {
  [Theme.Basic]: "Basic",
  [Theme.Daisy5]: "daisyUI v5",
  [Theme.Flowbite3]: "Flowbite Svelte",
  [Theme.Skeleton3]: "Skeleton v3",
  [Theme.Shadcn4]: "shadcn-svelte",
};

export const SJSF_THEMES: Record<Theme, SJSFTheme> = {
  [Theme.Basic]: basic,
  [Theme.Daisy5]: daisy5,
  [Theme.Flowbite3]: flowbite3,
  [Theme.Skeleton3]: skeleton3,
  [Theme.Shadcn4]: shadcn4,
};

export const THEME_STYLES: Record<Theme, string> = {
  [Theme.Basic]: "",
  [Theme.Daisy5]: daisy5Styles,
  [Theme.Flowbite3]: flowbite3Styles,
  [Theme.Skeleton3]: skeleton3Styles,
  [Theme.Shadcn4]: shadcn4Styles,
};

export const THEME_CONFLICTS: Record<Theme, ComponentType[][]> = {
  [Theme.Basic]: [],
  [Theme.Daisy5]: daisyui5conflicts,
  [Theme.Flowbite3]: [],
  [Theme.Skeleton3]: skeleton3conflicts,
  [Theme.Shadcn4]: [],
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
      Object.assign(merged[key]!, l, r);
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
