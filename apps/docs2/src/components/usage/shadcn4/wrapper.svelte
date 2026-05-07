<script lang="ts">
  import BitsUiProvider from "@/components/bits-ui-provider.svelte";
  import { createAstro } from '@/astro.svelte';

  import Form from "./form.svelte";

  const astro = createAstro()
</script>

<div class="demo-container {astro.darkOrLight}">
  <BitsUiProvider>
    <Form />
  </BitsUiProvider>
</div>
