import { s } from "testing/demo";

import "./extra-widgets/checkboxes-include.js";
import "./extra-widgets/date-picker-include.js";
import "./extra-widgets/file-include.js";
import "./extra-widgets/multi-select-include.js";
import "./extra-widgets/radio-include.js";
import "./extra-widgets/range-include.js";
import "./extra-widgets/textarea-include.js";

export const specs: s.Specs = {
  radio: [
    s.enumeration,
    {
      "ui:components": {
        stringField: "enumField",
        selectWidget: "radioWidget",
      },
      "ui:options": { useLabel: false },
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
  ],
  textarea: [s.text, { "ui:components": { textWidget: "textareaWidget" } }],
  datePicker: [s.text, { "ui:components": { textWidget: "datePickerWidget" } }],
  range: [s.number, { "ui:components": { numberWidget: "rangeWidget" } }],
};

export const extraWidgets = Object.keys(
  import.meta.glob("./extra-widgets/*.svelte")
).map((widget) => widget.substring(16, widget.length - 7));
