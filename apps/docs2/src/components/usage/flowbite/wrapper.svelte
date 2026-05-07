<script lang="ts">
  import { createAstro } from "@/astro.svelte";

  import Form from './form.svelte'

  const astro = createAstro()
</script>

<div class="demo-container {astro.darkOrLight}">
  <Form />
</div>
