<script lang="ts">
  import { ComponentsAndWidgets } from "theme-testing/demo";

  import './styles/basic.css'

  import { theme } from "./index.js";
  import { specs } from "./specs.js";
</script>

<ComponentsAndWidgets {theme} {specs} />
