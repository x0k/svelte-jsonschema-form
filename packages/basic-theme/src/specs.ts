import { s, DEFAULT_SPECS } from "theme-testing/specs";

import "./extra-widgets/checkboxes-include.js";
import "./extra-widgets/date-picker-include.js";
import "./extra-widgets/file-include.js";
import "./extra-widgets/multi-select-include.js";
import "./extra-widgets/radio-include.js";
import "./extra-widgets/range-include.js";
import "./extra-widgets/textarea-include.js";

export const specs: s.Specs = {
  ...DEFAULT_SPECS,
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
      onblur: "visitMultiSelect",
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
  datePicker: [
    s.text,
    { "ui:components": { textWidget: "datePickerWidget" } },
    {
      oninput: "inputDate",
      onchange: "changeDate",
      onblur: "visitDate",
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
};

export const extraWidgets = Object.keys(
  import.meta.glob("./extra-widgets/*.svelte")
).map((widget) => widget.substring(16, widget.length - 7));
