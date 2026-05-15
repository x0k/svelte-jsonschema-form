import { extendByRecord } from "@sjsf/form/lib/resolver";

import { fields } from "./fields.generated.ts";
import "./fields.generated.ts";

import { theme as basicBase } from "@sjsf/basic-theme";
import basic_checkboxesWidget from "@sjsf/basic-theme/extra-widgets/checkboxes.svelte";
import "@sjsf/basic-theme/extra-widgets/checkboxes.svelte";
import basic_datePickerWidget from "@sjsf/basic-theme/extra-widgets/date-picker.svelte";
import "@sjsf/basic-theme/extra-widgets/date-picker.svelte";
import basic_fileWidget from "@sjsf/basic-theme/extra-widgets/file.svelte";
import "@sjsf/basic-theme/extra-widgets/file.svelte";
import basic_multiSelectWidget from "@sjsf/basic-theme/extra-widgets/multi-select.svelte";
import "@sjsf/basic-theme/extra-widgets/multi-select.svelte";
import basic_radioWidget from "@sjsf/basic-theme/extra-widgets/radio.svelte";
import "@sjsf/basic-theme/extra-widgets/radio.svelte";
import basic_rangeWidget from "@sjsf/basic-theme/extra-widgets/range.svelte";
import "@sjsf/basic-theme/extra-widgets/range.svelte";
import basic_textareaWidget from "@sjsf/basic-theme/extra-widgets/textarea.svelte";
import "@sjsf/basic-theme/extra-widgets/textarea.svelte";
export const basicTheme = extendByRecord(basicBase, {
  ...fields,
  checkboxesWidget: basic_checkboxesWidget,
  datePickerWidget: basic_datePickerWidget,
  fileWidget: basic_fileWidget,
  multiSelectWidget: basic_multiSelectWidget,
  radioWidget: basic_radioWidget,
  rangeWidget: basic_rangeWidget,
  textareaWidget: basic_textareaWidget
});

import { theme as daisyui5Base } from "@sjsf/daisyui5-theme";
import daisyui5_daisyui5CallyDatePickerWidget from "@sjsf/daisyui5-theme/extra-widgets/cally-date-picker.svelte";
import "@sjsf/daisyui5-theme/extra-widgets/cally-date-picker.svelte";
import daisyui5_checkboxesWidget from "@sjsf/daisyui5-theme/extra-widgets/checkboxes.svelte";
import "@sjsf/daisyui5-theme/extra-widgets/checkboxes.svelte";
import daisyui5_datePickerWidget from "@sjsf/daisyui5-theme/extra-widgets/date-picker.svelte";
import "@sjsf/daisyui5-theme/extra-widgets/date-picker.svelte";
import daisyui5_fileWidget from "@sjsf/daisyui5-theme/extra-widgets/file.svelte";
import "@sjsf/daisyui5-theme/extra-widgets/file.svelte";
import daisyui5_daisyui5FilterRadioButtonsWidget from "@sjsf/daisyui5-theme/extra-widgets/filter-radio-buttons.svelte";
import "@sjsf/daisyui5-theme/extra-widgets/filter-radio-buttons.svelte";
import daisyui5_multiSelectWidget from "@sjsf/daisyui5-theme/extra-widgets/multi-select.svelte";
import "@sjsf/daisyui5-theme/extra-widgets/multi-select.svelte";
import daisyui5_radioButtonsWidget from "@sjsf/daisyui5-theme/extra-widgets/radio-buttons.svelte";
import "@sjsf/daisyui5-theme/extra-widgets/radio-buttons.svelte";
import daisyui5_radioWidget from "@sjsf/daisyui5-theme/extra-widgets/radio.svelte";
import "@sjsf/daisyui5-theme/extra-widgets/radio.svelte";
import daisyui5_rangeWidget from "@sjsf/daisyui5-theme/extra-widgets/range.svelte";
import "@sjsf/daisyui5-theme/extra-widgets/range.svelte";
import daisyui5_ratingWidget from "@sjsf/daisyui5-theme/extra-widgets/rating.svelte";
import "@sjsf/daisyui5-theme/extra-widgets/rating.svelte";
import daisyui5_switchWidget from "@sjsf/daisyui5-theme/extra-widgets/switch.svelte";
import "@sjsf/daisyui5-theme/extra-widgets/switch.svelte";
import daisyui5_textareaWidget from "@sjsf/daisyui5-theme/extra-widgets/textarea.svelte";
import "@sjsf/daisyui5-theme/extra-widgets/textarea.svelte";
export const daisyui5Theme = extendByRecord(daisyui5Base, {
  ...fields,
  daisyui5CallyDatePickerWidget: daisyui5_daisyui5CallyDatePickerWidget,
  checkboxesWidget: daisyui5_checkboxesWidget,
  datePickerWidget: daisyui5_datePickerWidget,
  fileWidget: daisyui5_fileWidget,
  daisyui5FilterRadioButtonsWidget: daisyui5_daisyui5FilterRadioButtonsWidget,
  multiSelectWidget: daisyui5_multiSelectWidget,
  radioButtonsWidget: daisyui5_radioButtonsWidget,
  radioWidget: daisyui5_radioWidget,
  rangeWidget: daisyui5_rangeWidget,
  ratingWidget: daisyui5_ratingWidget,
  switchWidget: daisyui5_switchWidget,
  textareaWidget: daisyui5_textareaWidget
});

import { theme as flowbite3Base } from "@sjsf/flowbite3-theme";
import flowbite3_checkboxesWidget from "@sjsf/flowbite3-theme/extra-widgets/checkboxes.svelte";
import "@sjsf/flowbite3-theme/extra-widgets/checkboxes.svelte";
import flowbite3_datePickerWidget from "@sjsf/flowbite3-theme/extra-widgets/date-picker.svelte";
import "@sjsf/flowbite3-theme/extra-widgets/date-picker.svelte";
import flowbite3_dateRangePickerWidget from "@sjsf/flowbite3-theme/extra-widgets/date-range-picker.svelte";
import "@sjsf/flowbite3-theme/extra-widgets/date-range-picker.svelte";
import flowbite3_fileWidget from "@sjsf/flowbite3-theme/extra-widgets/file.svelte";
import "@sjsf/flowbite3-theme/extra-widgets/file.svelte";
import flowbite3_multiSelectWidget from "@sjsf/flowbite3-theme/extra-widgets/multi-select.svelte";
import "@sjsf/flowbite3-theme/extra-widgets/multi-select.svelte";
import flowbite3_radioButtonsWidget from "@sjsf/flowbite3-theme/extra-widgets/radio-buttons.svelte";
import "@sjsf/flowbite3-theme/extra-widgets/radio-buttons.svelte";
import flowbite3_radioWidget from "@sjsf/flowbite3-theme/extra-widgets/radio.svelte";
import "@sjsf/flowbite3-theme/extra-widgets/radio.svelte";
import flowbite3_rangeWidget from "@sjsf/flowbite3-theme/extra-widgets/range.svelte";
import "@sjsf/flowbite3-theme/extra-widgets/range.svelte";
import flowbite3_switchWidget from "@sjsf/flowbite3-theme/extra-widgets/switch.svelte";
import "@sjsf/flowbite3-theme/extra-widgets/switch.svelte";
import flowbite3_tagsWidget from "@sjsf/flowbite3-theme/extra-widgets/tags.svelte";
import "@sjsf/flowbite3-theme/extra-widgets/tags.svelte";
import flowbite3_textareaWidget from "@sjsf/flowbite3-theme/extra-widgets/textarea.svelte";
import "@sjsf/flowbite3-theme/extra-widgets/textarea.svelte";
import flowbite3_flowbite3ToggleRadioButtonsWidget from "@sjsf/flowbite3-theme/extra-widgets/toggle-radio-buttons.svelte";
import "@sjsf/flowbite3-theme/extra-widgets/toggle-radio-buttons.svelte";
export const flowbite3Theme = extendByRecord(flowbite3Base, {
  ...fields,
  checkboxesWidget: flowbite3_checkboxesWidget,
  datePickerWidget: flowbite3_datePickerWidget,
  dateRangePickerWidget: flowbite3_dateRangePickerWidget,
  fileWidget: flowbite3_fileWidget,
  multiSelectWidget: flowbite3_multiSelectWidget,
  radioButtonsWidget: flowbite3_radioButtonsWidget,
  radioWidget: flowbite3_radioWidget,
  rangeWidget: flowbite3_rangeWidget,
  switchWidget: flowbite3_switchWidget,
  tagsWidget: flowbite3_tagsWidget,
  textareaWidget: flowbite3_textareaWidget,
  flowbite3ToggleRadioButtonsWidget: flowbite3_flowbite3ToggleRadioButtonsWidget
});

import { theme as shadcn4Base } from "@sjsf/shadcn4-theme";
import shadcn4_checkboxesWidget from "@sjsf/shadcn4-theme/extra-widgets/checkboxes.svelte";
import "@sjsf/shadcn4-theme/extra-widgets/checkboxes.svelte";
import shadcn4_comboboxWidget from "@sjsf/shadcn4-theme/extra-widgets/combobox.svelte";
import "@sjsf/shadcn4-theme/extra-widgets/combobox.svelte";
import shadcn4_datePickerWidget from "@sjsf/shadcn4-theme/extra-widgets/date-picker.svelte";
import "@sjsf/shadcn4-theme/extra-widgets/date-picker.svelte";
import shadcn4_dateRangePickerWidget from "@sjsf/shadcn4-theme/extra-widgets/date-range-picker.svelte";
import "@sjsf/shadcn4-theme/extra-widgets/date-range-picker.svelte";
import shadcn4_fileWidget from "@sjsf/shadcn4-theme/extra-widgets/file.svelte";
import "@sjsf/shadcn4-theme/extra-widgets/file.svelte";
import shadcn4_multiSelectWidget from "@sjsf/shadcn4-theme/extra-widgets/multi-select.svelte";
import "@sjsf/shadcn4-theme/extra-widgets/multi-select.svelte";
import shadcn4_radioButtonsWidget from "@sjsf/shadcn4-theme/extra-widgets/radio-buttons.svelte";
import "@sjsf/shadcn4-theme/extra-widgets/radio-buttons.svelte";
import shadcn4_radioWidget from "@sjsf/shadcn4-theme/extra-widgets/radio.svelte";
import "@sjsf/shadcn4-theme/extra-widgets/radio.svelte";
import shadcn4_rangeSliderWidget from "@sjsf/shadcn4-theme/extra-widgets/range-slider.svelte";
import "@sjsf/shadcn4-theme/extra-widgets/range-slider.svelte";
import shadcn4_rangeWidget from "@sjsf/shadcn4-theme/extra-widgets/range.svelte";
import "@sjsf/shadcn4-theme/extra-widgets/range.svelte";
import shadcn4_switchWidget from "@sjsf/shadcn4-theme/extra-widgets/switch.svelte";
import "@sjsf/shadcn4-theme/extra-widgets/switch.svelte";
import shadcn4_textareaWidget from "@sjsf/shadcn4-theme/extra-widgets/textarea.svelte";
import "@sjsf/shadcn4-theme/extra-widgets/textarea.svelte";
export const shadcn4Theme = extendByRecord(shadcn4Base, {
  ...fields,
  checkboxesWidget: shadcn4_checkboxesWidget,
  comboboxWidget: shadcn4_comboboxWidget,
  datePickerWidget: shadcn4_datePickerWidget,
  dateRangePickerWidget: shadcn4_dateRangePickerWidget,
  fileWidget: shadcn4_fileWidget,
  multiSelectWidget: shadcn4_multiSelectWidget,
  radioButtonsWidget: shadcn4_radioButtonsWidget,
  radioWidget: shadcn4_radioWidget,
  rangeSliderWidget: shadcn4_rangeSliderWidget,
  rangeWidget: shadcn4_rangeWidget,
  switchWidget: shadcn4_switchWidget,
  textareaWidget: shadcn4_textareaWidget
});

import { theme as skeleton4Base } from "@sjsf/skeleton4-theme";
import skeleton4_checkboxesWidget from "@sjsf/skeleton4-theme/extra-widgets/checkboxes.svelte";
import "@sjsf/skeleton4-theme/extra-widgets/checkboxes.svelte";
import skeleton4_comboboxWidget from "@sjsf/skeleton4-theme/extra-widgets/combobox.svelte";
import "@sjsf/skeleton4-theme/extra-widgets/combobox.svelte";
import skeleton4_datePickerWidget from "@sjsf/skeleton4-theme/extra-widgets/date-picker.svelte";
import "@sjsf/skeleton4-theme/extra-widgets/date-picker.svelte";
import skeleton4_dateRangePickerWidget from "@sjsf/skeleton4-theme/extra-widgets/date-range-picker.svelte";
import "@sjsf/skeleton4-theme/extra-widgets/date-range-picker.svelte";
import skeleton4_skeleton4FileUploadWidget from "@sjsf/skeleton4-theme/extra-widgets/file-upload.svelte";
import "@sjsf/skeleton4-theme/extra-widgets/file-upload.svelte";
import skeleton4_fileWidget from "@sjsf/skeleton4-theme/extra-widgets/file.svelte";
import "@sjsf/skeleton4-theme/extra-widgets/file.svelte";
import skeleton4_multiSelectWidget from "@sjsf/skeleton4-theme/extra-widgets/multi-select.svelte";
import "@sjsf/skeleton4-theme/extra-widgets/multi-select.svelte";
import skeleton4_radioButtonsWidget from "@sjsf/skeleton4-theme/extra-widgets/radio-buttons.svelte";
import "@sjsf/skeleton4-theme/extra-widgets/radio-buttons.svelte";
import skeleton4_radioWidget from "@sjsf/skeleton4-theme/extra-widgets/radio.svelte";
import "@sjsf/skeleton4-theme/extra-widgets/radio.svelte";
import skeleton4_rangeSliderWidget from "@sjsf/skeleton4-theme/extra-widgets/range-slider.svelte";
import "@sjsf/skeleton4-theme/extra-widgets/range-slider.svelte";
import skeleton4_rangeWidget from "@sjsf/skeleton4-theme/extra-widgets/range.svelte";
import "@sjsf/skeleton4-theme/extra-widgets/range.svelte";
import skeleton4_ratingWidget from "@sjsf/skeleton4-theme/extra-widgets/rating.svelte";
import "@sjsf/skeleton4-theme/extra-widgets/rating.svelte";
import skeleton4_skeleton4SliderWidget from "@sjsf/skeleton4-theme/extra-widgets/slider.svelte";
import "@sjsf/skeleton4-theme/extra-widgets/slider.svelte";
import skeleton4_switchWidget from "@sjsf/skeleton4-theme/extra-widgets/switch.svelte";
import "@sjsf/skeleton4-theme/extra-widgets/switch.svelte";
import skeleton4_tagsWidget from "@sjsf/skeleton4-theme/extra-widgets/tags.svelte";
import "@sjsf/skeleton4-theme/extra-widgets/tags.svelte";
import skeleton4_textareaWidget from "@sjsf/skeleton4-theme/extra-widgets/textarea.svelte";
import "@sjsf/skeleton4-theme/extra-widgets/textarea.svelte";
export const skeleton4Theme = extendByRecord(skeleton4Base, {
  ...fields,
  checkboxesWidget: skeleton4_checkboxesWidget,
  comboboxWidget: skeleton4_comboboxWidget,
  datePickerWidget: skeleton4_datePickerWidget,
  dateRangePickerWidget: skeleton4_dateRangePickerWidget,
  skeleton4FileUploadWidget: skeleton4_skeleton4FileUploadWidget,
  fileWidget: skeleton4_fileWidget,
  multiSelectWidget: skeleton4_multiSelectWidget,
  radioButtonsWidget: skeleton4_radioButtonsWidget,
  radioWidget: skeleton4_radioWidget,
  rangeSliderWidget: skeleton4_rangeSliderWidget,
  rangeWidget: skeleton4_rangeWidget,
  ratingWidget: skeleton4_ratingWidget,
  skeleton4SliderWidget: skeleton4_skeleton4SliderWidget,
  switchWidget: skeleton4_switchWidget,
  tagsWidget: skeleton4_tagsWidget,
  textareaWidget: skeleton4_textareaWidget
});

import { theme as beercssBase } from "@sjsf-lab/beercss-theme";
import beercss_checkboxesWidget from "@sjsf-lab/beercss-theme/extra-widgets/checkboxes.svelte";
import "@sjsf-lab/beercss-theme/extra-widgets/checkboxes.svelte";
import beercss_datePickerWidget from "@sjsf-lab/beercss-theme/extra-widgets/date-picker.svelte";
import "@sjsf-lab/beercss-theme/extra-widgets/date-picker.svelte";
import beercss_fileWidget from "@sjsf-lab/beercss-theme/extra-widgets/file.svelte";
import "@sjsf-lab/beercss-theme/extra-widgets/file.svelte";
import beercss_radioWidget from "@sjsf-lab/beercss-theme/extra-widgets/radio.svelte";
import "@sjsf-lab/beercss-theme/extra-widgets/radio.svelte";
import beercss_rangeWidget from "@sjsf-lab/beercss-theme/extra-widgets/range.svelte";
import "@sjsf-lab/beercss-theme/extra-widgets/range.svelte";
import beercss_switchWidget from "@sjsf-lab/beercss-theme/extra-widgets/switch.svelte";
import "@sjsf-lab/beercss-theme/extra-widgets/switch.svelte";
import beercss_textareaWidget from "@sjsf-lab/beercss-theme/extra-widgets/textarea.svelte";
import "@sjsf-lab/beercss-theme/extra-widgets/textarea.svelte";
export const beercssTheme = extendByRecord(beercssBase, {
  ...fields,
  checkboxesWidget: beercss_checkboxesWidget,
  datePickerWidget: beercss_datePickerWidget,
  fileWidget: beercss_fileWidget,
  radioWidget: beercss_radioWidget,
  rangeWidget: beercss_rangeWidget,
  switchWidget: beercss_switchWidget,
  textareaWidget: beercss_textareaWidget
});

// skip "shadcn-extras" theme

import { theme as svarBase } from "@sjsf-lab/svar-theme";
import svar_checkboxesWidget from "@sjsf-lab/svar-theme/extra-widgets/checkboxes.svelte";
import "@sjsf-lab/svar-theme/extra-widgets/checkboxes.svelte";
import svar_svarColorPickerWidget from "@sjsf-lab/svar-theme/extra-widgets/color-picker.svelte";
import "@sjsf-lab/svar-theme/extra-widgets/color-picker.svelte";
import svar_svarColorSelectWidget from "@sjsf-lab/svar-theme/extra-widgets/color-select.svelte";
import "@sjsf-lab/svar-theme/extra-widgets/color-select.svelte";
import svar_comboboxWidget from "@sjsf-lab/svar-theme/extra-widgets/combobox.svelte";
import "@sjsf-lab/svar-theme/extra-widgets/combobox.svelte";
import svar_datePickerWidget from "@sjsf-lab/svar-theme/extra-widgets/date-picker.svelte";
import "@sjsf-lab/svar-theme/extra-widgets/date-picker.svelte";
import svar_dateRangePickerWidget from "@sjsf-lab/svar-theme/extra-widgets/date-range-picker.svelte";
import "@sjsf-lab/svar-theme/extra-widgets/date-range-picker.svelte";
import svar_multiSelectWidget from "@sjsf-lab/svar-theme/extra-widgets/multi-select.svelte";
import "@sjsf-lab/svar-theme/extra-widgets/multi-select.svelte";
import svar_radioButtonsWidget from "@sjsf-lab/svar-theme/extra-widgets/radio-buttons.svelte";
import "@sjsf-lab/svar-theme/extra-widgets/radio-buttons.svelte";
import svar_radioWidget from "@sjsf-lab/svar-theme/extra-widgets/radio.svelte";
import "@sjsf-lab/svar-theme/extra-widgets/radio.svelte";
import svar_rangeWidget from "@sjsf-lab/svar-theme/extra-widgets/range.svelte";
import "@sjsf-lab/svar-theme/extra-widgets/range.svelte";
import svar_switchWidget from "@sjsf-lab/svar-theme/extra-widgets/switch.svelte";
import "@sjsf-lab/svar-theme/extra-widgets/switch.svelte";
import svar_textareaWidget from "@sjsf-lab/svar-theme/extra-widgets/textarea.svelte";
import "@sjsf-lab/svar-theme/extra-widgets/textarea.svelte";
export const svarTheme = extendByRecord(svarBase, {
  ...fields,
  checkboxesWidget: svar_checkboxesWidget,
  svarColorPickerWidget: svar_svarColorPickerWidget,
  svarColorSelectWidget: svar_svarColorSelectWidget,
  comboboxWidget: svar_comboboxWidget,
  datePickerWidget: svar_datePickerWidget,
  dateRangePickerWidget: svar_dateRangePickerWidget,
  multiSelectWidget: svar_multiSelectWidget,
  radioButtonsWidget: svar_radioButtonsWidget,
  radioWidget: svar_radioWidget,
  rangeWidget: svar_rangeWidget,
  switchWidget: svar_switchWidget,
  textareaWidget: svar_textareaWidget
});

// skip "daisyui" theme

// skip "flowbite" theme

// skip "shadcn" theme

// skip "skeleton3" theme
