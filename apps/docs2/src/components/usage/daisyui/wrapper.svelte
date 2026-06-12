<script lang="ts">
  import { themeManager } from "@/theme.svelte";

  import Form from "./form.svelte";
</script>

<div
  class="demo-container"
  data-theme={themeManager.darkOrLight}
  style="background-color: transparent;"
>
  <Form />
</div>
