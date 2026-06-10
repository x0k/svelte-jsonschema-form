import type { WidgetTypes } from "../widgets.ts";
import type { ToTheme } from "../themes.ts";
import type { ExtraFieldFileName } from "../fields.ts";

import type { PlaygroundTheme } from "./model.ts";

type PlaygroundWidgetType = WidgetTypes[ToTheme<PlaygroundTheme>];

export const WIDGET_EXTRA_FIELD: Record<
  PlaygroundWidgetType,
  ExtraFieldFileName | undefined
> = {
  checkboxWidget: undefined,
  numberWidget: undefined,
  selectWidget: "enum",
  textWidget: undefined,
  aggregatedWidget: "aggregated",
  checkboxesWidget: "multi-enum",
  comboboxWidget: "enum",
  daisyui5CallyDatePickerWidget: undefined,
  daisyui5FilterRadioButtonsWidget: "enum",
  datePickerWidget: undefined,
  dateRangePickerWidget: "aggregated",
  fileWidget: undefined,
  flowbite3ToggleRadioButtonsWidget: "enum",
  multiSelectWidget: "multi-enum",
  radioButtonsWidget: "enum",
  radioWidget: "enum",
  rangeSliderWidget: "aggregated",
  rangeWidget: undefined,
  ratingWidget: undefined,
  shadcnExtrasFileDropZoneWidget: undefined,
  shadcnExtrasIPv4AddressInputWidget: undefined,
  shadcnExtrasNLPDateInputWidget: undefined,
  shadcnExtrasPasswordWidget: undefined,
  shadcnExtrasPhoneInputWidget: undefined,
  shadcnExtrasStarRatingWidget: undefined,
  shadcnExtrasTagsInputWidget: "array-tags",
  skeleton4FileUploadWidget: undefined,
  skeleton4SliderWidget: undefined,
  svarColorPickerWidget: undefined,
  svarColorSelectWidget: undefined,
  switchWidget: undefined,
  tagsWidget: "array-tags",
  textareaWidget: undefined,
};
