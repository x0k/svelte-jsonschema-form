<script lang="ts">
  import { ComponentsAndWidgets } from "testing/demo";

  import { theme } from "./index.js";
  import "./extra-widgets/multi-select-include.js";
  import "./extra-widgets/textarea-include.js";
  import "./extra-widgets/date-picker-include.js";
  import "./extra-widgets/range-include.js";
</script>

<ComponentsAndWidgets {theme} />
