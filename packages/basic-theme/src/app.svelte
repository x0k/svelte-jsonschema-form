<script lang="ts">
  import { ComponentsAndWidgets } from "theme-testing/demo";

  // import "@picocss/pico/css/pico.css"
  // import './css/pico.css'
  import './css/basic.css';

  import { theme } from "./index.js";
  import { specs } from "./specs.js";
</script>

<ComponentsAndWidgets {theme} {specs} />
