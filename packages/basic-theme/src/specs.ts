import { s } from "testing/demo";

import "./extra-widgets/checkboxes-include.js";
import "./extra-widgets/date-picker-include.js";
import "./extra-widgets/file-include.js";
import "./extra-widgets/multi-select-include.js";
import "./extra-widgets/radio-include.js";
import "./extra-widgets/range-include.js";
import "./extra-widgets/textarea-include.js";

export const specs: s.Specs = {
  radio: [s.enumeration, { "ui:components": { selectWidget: "radioWidget" } }],
  multiSelect: [
    s.uniqueArray,
    { "ui:components": { checkboxesWidget: "multiSelectWidget" } },
  ],
  textarea: [s.text, { "ui:components": { textWidget: "textareaWidget" } }],
  datePicker: [s.text, { "ui:components": { textWidget: "datePickerWidget" } }],
  range: [s.number, { "ui:components": { numberWidget: "rangeWidget" } }],
};
