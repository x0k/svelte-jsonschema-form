import type { PlaygroundTheme } from "../playground/index.ts";
import type { ToTheme } from "../themes.ts";
import type { WidgetTypes } from "../widgets.ts";

export type WidgetType = WidgetTypes[ToTheme<PlaygroundTheme>];

export const WIDGET_NAMES: Record<WidgetType, string> = {
  checkboxWidget: "Checkbox",
  numberWidget: "Number input",
  selectWidget: "Select",
  textWidget: "Text input",
  aggregatedWidget: "Invalid widget",
  checkboxesWidget: "Checkboxes",
  comboboxWidget: "Combobox",
  daisyui5CallyDatePickerWidget: "Cally date picker",
  daisyui5FilterRadioButtonsWidget: "Filter radio buttons",
  datePickerWidget: "Date picker",
  dateRangePickerWidget: "Date range picker",
  fileWidget: "File input",
  flowbite3ToggleRadioButtonsWidget: "Toggle radio buttons",
  multiSelectWidget: "Multi Select",
  radioButtonsWidget: "Radio buttons",
  radioWidget: "Radio group",
  rangeSliderWidget: "Range slider",
  rangeWidget: "Range",
  ratingWidget: "Rating",
  shadcnExtrasFileDropZoneWidget: "Drop zone",
  shadcnExtrasIPv4AddressInputWidget: "IP v4 address input",
  shadcnExtrasNLPDateInputWidget: "NLP date input",
  shadcnExtrasPasswordWidget: "Password input",
  shadcnExtrasPhoneInputWidget: "Phone input",
  shadcnExtrasStarRatingWidget: "Rating",
  shadcnExtrasTagsInputWidget: "Tags",
  skeleton4FileUploadWidget: "Drop zone",
  skeleton4SliderWidget: "Slider",
  svarColorPickerWidget: "Color picker",
  svarColorSelectWidget: "Color select",
  switchWidget: "Switch",
  tagsWidget: "Tags",
  textareaWidget: "Textarea",
};
