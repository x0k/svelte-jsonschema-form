<script lang="ts">
  import { themeManager } from "@/theme.svelte";

  import Form from "./form.svelte";
</script>

<div class="demo-container {themeManager.darkOrLight}">
  <Form />
</div>
