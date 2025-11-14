<script lang="ts">
  import { createAstro } from "@/astro.svelte";

  import Form from "./form.svelte";

  const astro = createAstro();
</script>

<div
  class="demo-container"
  data-theme={astro.darkOrLight}
  style="background-color: transparent;"
>
  <Form />
</div>
