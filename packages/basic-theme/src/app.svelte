<script lang="ts">
  import { ComponentsAndWidgets, s } from "testing/demo";

  import { theme } from "./index.js";
  import "./extra-widgets/multi-select-include.js";
  import "./extra-widgets/textarea-include.js";
  import "./extra-widgets/date-picker-include.js";
  import "./extra-widgets/range-include.js";
</script>

<ComponentsAndWidgets
  {theme}
  additionalSpecs={{
    multiSelect: [
      s.uniqueArray,
      { "ui:components": { checkboxesWidget: "multiSelectWidget" } },
    ],
    textarea: [s.text, { "ui:components": { textWidget: "textareaWidget" } }],
    datePicker: [
      s.text,
      { "ui:components": { textWidget: "datePickerWidget" } },
    ],
    range: [s.number, { "ui:components": { numberWidget: "rangeWidget" } }],
  }}
/>
