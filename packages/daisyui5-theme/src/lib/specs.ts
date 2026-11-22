import { s, DEFAULT_SPECS } from "theme-testing/specs";

import "./extra-widgets/checkboxes-include.js";
import "./extra-widgets/date-input-include.js";
import "./extra-widgets/file-include.js";
import "./extra-widgets/filter-radio-buttons-include.js";
import "./extra-widgets/multi-select-include.js";
import "./extra-widgets/radio-buttons-include.js";
import "./extra-widgets/radio-include.js";
import "./extra-widgets/range-include.js";
import "./extra-widgets/rating-include.js";
import "./extra-widgets/switch-include.js";
import "./extra-widgets/textarea-include.js";
import "./extra-widgets/date-picker-include.js";
import "./extra-widgets/vc-date-picker-include.js";

export const specs: s.Specs = {
  ...DEFAULT_SPECS,
  dateInput: [
    s.date,
    { "ui:components": { stringField: "dateField" } },
    {
      // Typed text is committed on `change`, so `oninput` validation is not
      // supported.
      onchange: "changeDate",
      onblur: "visitDate",
    },
  ],
  dateTimeInput: [
    s.dateTime,
    { "ui:components": { stringField: "dateField" } },
    {
      onchange: "changeDateTime",
      onblur: "visitDateTime",
    },
  ],
  timeInput: [
    s.time,
    { "ui:components": { stringField: "dateField" } },
    {
      onchange: "changeTime",
      onblur: "visitTime",
    },
  ],
  datePicker: [
    s.text,
    {
      "ui:components": { textWidget: "datePickerWidget" },
      "ui:options": { useLabel: false },
    },
    {
      onchange: "changeCallyDatePicker",
    },
  ],
  filterRadioButtons: [
    s.enumeration,
    {
      "ui:components": {
        stringField: "enumField",
        selectWidget: "daisyui5FilterRadioButtonsWidget",
      },
      "ui:options": { useLabel: false },
    },
    {
      oninput: "inputRadio",
      onchange: "changeRadio",
      onblur: "visitRadio",
    },
  ],
  multiSelect: [
    s.uniqueArray,
    {
      "ui:components": {
        arrayField: "multiEnumField",
        checkboxesWidget: "multiSelectWidget",
      },
      "ui:options": { useLabel: true },
    },
    {
      oninput: "inputMultiSelect",
      onchange: "changeMultiSelect",
      // Disabled due chrome bug (works in firefox)
      // TODO: Enable this test after playwright browsers update
      // onblur: 'visitMultiSelect'
    },
  ],
  radioButtons: [
    s.enumeration,
    {
      "ui:components": {
        stringField: "enumField",
        selectWidget: "radioButtonsWidget",
      },
      "ui:options": { useLabel: false },
    },
    {
      oninput: "inputRadio",
      onchange: "changeRadio",
      onblur: "visitRadio",
    },
  ],
  radio: [
    s.enumeration,
    {
      "ui:components": {
        stringField: "enumField",
        selectWidget: "radioWidget",
      },
      "ui:options": { useLabel: false },
    },
    {
      oninput: "inputRadio",
      onchange: "changeRadio",
      onblur: "visitRadio",
    },
  ],
  range: [
    s.number,
    { "ui:components": { numberWidget: "rangeWidget" } },
    {
      oninput: "inputSlider",
      onchange: "changeSlider",
      onblur: "visitSlider",
    },
  ],
  rating: [
    s.number,
    {
      "ui:components": { numberWidget: "ratingWidget" },
      "ui:options": { useLabel: false },
    },
    {
      oninput: "inputRadio",
      onchange: "changeRadio",
      onblur: "visitRadio",
    },
  ],
  switch: [
    s.boolean,
    { "ui:components": { checkboxWidget: "switchWidget" } },
    {
      oninput: "inputCheckbox",
      onchange: "changeCheckbox",
      onblur: "visitCheckbox",
    },
  ],
  textarea: [
    s.text,
    { "ui:components": { textWidget: "textareaWidget" } },
    {
      oninput: "inputText",
      onchange: "changeText",
      onblur: "visitText",
    },
  ],
  vcDatePicker: [
    s.text,
    {
      "ui:components": { textWidget: "daisyui5VcDatePickerWidget" },
    },
    {
      oninput: "inputDate",
      onchange: "changeVcDatePicker",
      onblur: "visitDate",
    },
  ],
};

export const extraWidgets = Object.keys(
  import.meta.glob("./extra-widgets/*.svelte")
).map((widget) => widget.substring(16, widget.length - 7));
