import type { WidgetType } from "./widget-names.ts";
import { NodeType, RangeValueType } from "./node-types.ts";

export const WIDGET_NODE_TYPE: Record<WidgetType, NodeType> = {
  textWidget: NodeType.String,
  numberWidget: NodeType.Number,
  selectWidget: NodeType.Enum,
  checkboxWidget: NodeType.Boolean,
  textareaWidget: NodeType.String,
  datePickerWidget: NodeType.String,
  radioWidget: NodeType.Enum,
  rangeWidget: NodeType.Number,
  fileWidget: NodeType.File,
  checkboxesWidget: NodeType.MultiEnum,
  multiSelectWidget: NodeType.MultiEnum,
  switchWidget: NodeType.Boolean,
  radioButtonsWidget: NodeType.Enum,
  comboboxWidget: NodeType.Enum,
  ratingWidget: NodeType.Number,
  tagsWidget: NodeType.Tags,
  dateRangePickerWidget: NodeType.Range,
  rangeSliderWidget: NodeType.Range,
  aggregatedWidget: NodeType.Range,
  daisyui5CallyDatePickerWidget: NodeType.String,
  daisyui5FilterRadioButtonsWidget: NodeType.Enum,
  flowbite3ToggleRadioButtonsWidget: NodeType.Enum,
  skeleton4SliderWidget: NodeType.Number,
  skeleton4FileUploadWidget: NodeType.File,
  svarColorPickerWidget: NodeType.String,
  svarColorSelectWidget: NodeType.String,
  shadcnExtrasFileDropZoneWidget: NodeType.File,
  shadcnExtrasIPv4AddressInputWidget: NodeType.String,
  shadcnExtrasNLPDateInputWidget: NodeType.String,
  shadcnExtrasPasswordWidget: NodeType.String,
  shadcnExtrasPhoneInputWidget: NodeType.String,
  shadcnExtrasStarRatingWidget: NodeType.Number,
  shadcnExtrasTagsInputWidget: NodeType.Tags,
};

export const WIDGET_RANGE_VALUE_TYPE: Partial<
  Record<WidgetType, RangeValueType>
> = {
  dateRangePickerWidget: RangeValueType.String,
  rangeSliderWidget: RangeValueType.Number,
};

export const RANGE_VALUE_TYPE_TO_WIDGET = Object.fromEntries(
  Object.entries(WIDGET_RANGE_VALUE_TYPE).map(([k, v]) => [v, k])
) as Record<RangeValueType, string>;
