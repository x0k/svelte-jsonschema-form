import { s, DEFAULT_SPECS } from "theme-testing/specs";

import "./extra-widgets/checkboxes-include.js";
import "./extra-widgets/file-include.js";
import "./extra-widgets/radio-include.js";
import "./extra-widgets/range-include.js";
import "./extra-widgets/switch-include.js";
import "./extra-widgets/textarea-include.js";
import "./extra-widgets/date-picker-include.js";

export const specs: s.Specs = {
  ...DEFAULT_SPECS,
  checkbox: [
    s.boolean,
    {
      "ui:options": {
        title: s.CHECKBOX_LABEL_TEXT,
      },
    },
    {
      oninput: "inputSvarCheckbox",
      onchange: "changeSvarCheckbox",
      onblur: "visitSvarCheckbox",
    },
  ],
  checkboxes: [
    s.uniqueArray,
    {
      "ui:components": {
        arrayField: "multiEnumField",
      },
    },
    {
      // oninput: 'inputSvarCheckbox',
      // onchange: 'changeSvarCheckbox',
      // onblur: "visitSvarCheckbox",
    },
  ],
  datePicker: [
    s.text,
    { "ui:components": { textWidget: "datePickerWidget" } },
    {
      oninput: "inputDate",
      onchange: "changeDate",
      onblur: "visitDate",
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
      // oninput: 'inputRadio',
      // onchange: 'changeRadio',
      // onblur: 'visitRadio'
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
  switch: [
    s.boolean,
    {
      "ui:components": { checkboxWidget: "switchWidget" },
      "ui:options": {
        title: s.SWITCH_LABEL_TEXT,
      },
    },
    {
      oninput: "inputSwitch",
      onchange: "changeSwitch",
      onblur: "visitSwitch",
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
};

export const extraWidgets = Object.keys(
  import.meta.glob("./extra-widgets/*.svelte")
).map((widget) => widget.substring(16, widget.length - 7));
