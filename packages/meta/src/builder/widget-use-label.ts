import type { PlaygroundTheme } from "../playground/index.ts";
import type { WidgetType } from "./widget-names.ts";

const WIDGET_USE_LABEL: Record<WidgetType, boolean | Set<PlaygroundTheme>> = {
  textWidget: true,
  numberWidget: true,
  selectWidget: true,
  checkboxWidget: true,
  fileWidget: true,
  checkboxesWidget: false,
  tagsWidget: true,
  datePickerWidget: true,
  multiSelectWidget: true,
  radioWidget: false,
  rangeWidget: true,
  textareaWidget: true,
  radioButtonsWidget: false,
  ratingWidget: false,
  switchWidget: true,
  comboboxWidget: true,
  daisyui5FilterRadioButtonsWidget: false,
  daisyui5CallyDatePickerWidget: true,
  skeleton4SliderWidget: true,
  skeleton4FileUploadWidget: true,
  flowbite3ToggleRadioButtonsWidget: false,
  aggregatedWidget: false,
  svarColorPickerWidget: true,
  svarColorSelectWidget: true,
  dateRangePickerWidget: new Set(["svar", "flowbite3"]),
  rangeSliderWidget: false,
  shadcnExtrasFileDropZoneWidget: true,
  shadcnExtrasIPv4AddressInputWidget: false,
  shadcnExtrasNLPDateInputWidget: false,
  shadcnExtrasPasswordWidget: true,
  shadcnExtrasPhoneInputWidget: true,
  shadcnExtrasStarRatingWidget: false,
  shadcnExtrasTagsInputWidget: true,
};

export function getUseLabel(
  theme: PlaygroundTheme,
  widgetType: WidgetType,
): boolean {
  const useLabel = WIDGET_USE_LABEL[widgetType];
  if (typeof useLabel === "boolean") {
    return useLabel;
  }
  return useLabel.has(theme);
}
