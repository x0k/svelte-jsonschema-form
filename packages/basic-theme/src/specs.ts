import { s, t, DEFAULT_SPECS } from "testing/demo";

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
      oninput: t.inputRadio,
      onchange: t.changeRadio,
      onblur: t.visitRadio,
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
      oninput: t.inputMultiSelect,
      onchange: t.changeMultiSelect,
      onblur: t.visitMultiSelect,
    },
  ],
  textarea: [
    s.text,
    { "ui:components": { textWidget: "textareaWidget" } },
    {
      oninput: t.inputText,
      onchange: t.changeText,
      onblur: t.visitText,
    },
  ],
  datePicker: [
    s.text,
    { "ui:components": { textWidget: "datePickerWidget" } },
    {
      oninput: t.inputDate,
      onchange: t.changeDate,
      onblur: t.visitDate,
    },
  ],
  range: [
    s.number,
    { "ui:components": { numberWidget: "rangeWidget" } },
    {
      oninput: t.inputSlider,
      onchange: t.changeSlider,
      onblur: t.visitSlider,
    },
  ],
};

export const extraWidgets = Object.keys(
  import.meta.glob("./extra-widgets/*.svelte")
).map((widget) => widget.substring(16, widget.length - 7));
