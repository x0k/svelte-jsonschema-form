<script lang="ts">
  import BitsUiProvider from "@/components/bits-ui-provider.svelte";
  import { themeManager } from "@/theme.svelte";

  import Form from "./form.svelte";
</script>

<div class="demo-container {themeManager.darkOrLight}">
  <BitsUiProvider>
    <Form />
  </BitsUiProvider>
</div>
