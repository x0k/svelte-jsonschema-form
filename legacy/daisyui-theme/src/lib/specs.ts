import { s, DEFAULT_SPECS } from "theme-testing/specs";

import "./extra-widgets/checkboxes-include.js";
import "./extra-widgets/date-picker-include.js";
import "./extra-widgets/file-include.js";
import "./extra-widgets/multi-select-include.js";
import "./extra-widgets/radio-buttons-include.js";
import "./extra-widgets/radio-include.js";
import "./extra-widgets/range-include.js";
import "./extra-widgets/switch-include.js";
import "./extra-widgets/textarea-include.js";

export const specs: s.Specs = {
  ...DEFAULT_SPECS,
  datePicker: [
    s.text,
    { "ui:components": { textWidget: "datePickerWidget" } },
    {},
  ],
  multiSelect: [
    s.uniqueArray,
    {
      "ui:components": {
        arrayField: "multiEnumField",
        checkboxesWidget: "multiSelectWidget",
      },
    },
    {},
  ],
  radioButtons: [
    s.enumeration,
    {
      "ui:components": {
        stringField: "enumField",
        selectWidget: "radioButtonsWidget",
      },
    },
    {},
  ],
  radio: [
    s.enumeration,
    {
      "ui:components": {
        stringField: "enumField",
        selectWidget: "radioWidget",
      },
    },
    {},
  ],
  range: [s.number, { "ui:components": { numberWidget: "rangeWidget" } }, {}],
  switch: [
    s.boolean,
    { "ui:components": { checkboxWidget: "switchWidget" } },
    {},
  ],
  textarea: [s.text, { "ui:components": { textWidget: "textareaWidget" } }, {}],
};

export const extraWidgets = Object.keys(
  import.meta.glob("./extra-widgets/*.svelte")
).map((widget) => widget.substring(16, widget.length - 7));
