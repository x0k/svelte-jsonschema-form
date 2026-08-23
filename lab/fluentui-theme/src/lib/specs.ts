import { s, DEFAULT_SPECS } from "theme-testing/specs";
import "@sjsf/form/fields/extra/array-tags-include";
import "@sjsf/form/fields/extra/array-files-include";
import "@sjsf/form/fields/extra/aggregated-include";

import "./extra-widgets/checkboxes-include.js";
import "./extra-widgets/combobox-include.js";
import "./extra-widgets/date-picker-include.js";
import "./extra-widgets/multi-select-include.js";
import "./extra-widgets/radio-include.js";
import "./extra-widgets/range-include.js";
import "./extra-widgets/switch-include.js";
import "./extra-widgets/textarea-include.js";

function prepareSpecs(specs: s.Specs) {
  const copy = structuredClone(specs);
  delete copy.file;
  delete copy.multiFile;
  for (const key of Object.keys(copy)) {
    const spec = copy[key];
    delete spec[2].onblur;
    switch (key) {
      case "checkbox": {
        spec[1]["ui:options"] = { title: "checkbox" };
        break;
      }
      case "checkboxes": {
        spec[2] = {
          oninput: "inputMultiSelect",
          onchange: "changeMultiSelect",
        };
        break;
      }
    }
  }
  return copy;
}

export const specs: s.Specs = {
  ...prepareSpecs(DEFAULT_SPECS),
  combobox: [
    s.enumeration,
    {
      "ui:components": {
        stringField: "enumField",
        selectWidget: "comboboxWidget",
      },
    },
    {},
  ],
  datePicker: [
    s.text,
    { "ui:components": { textWidget: "datePickerWidget" } },
    {
      onchange: "changeFluentuiDatePicker",
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
    {},
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
    },
  ],
  range: [
    s.number,
    { "ui:components": { numberWidget: "rangeWidget" } },
    {
      oninput: "inputSlider",
      onchange: "changeSlider",
    },
  ],
  switch: [
    s.boolean,
    { "ui:components": { checkboxWidget: "switchWidget" } },
    {},
  ],
  textarea: [
    s.text,
    { "ui:components": { textWidget: "textareaWidget" } },
    {
      oninput: "inputText",
      onchange: "changeText",
    },
  ],
};

export const extraWidgets = Object.keys(
  import.meta.glob("./extra-widgets/*.svelte")
).map((widget) => widget.substring(16, widget.length - 7));
