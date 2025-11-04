<script lang="ts">
  import { BasicForm, createForm, getErrors, hasErrors } from "@sjsf/form";

  import * as defaults from "@/lib/form/defaults";

  import { objectSchema } from "./demo-schemas";

  const form = createForm({
    ...defaults,
    schema: objectSchema,
  });
</script>

<BasicForm {form} novalidate />

{#if hasErrors(form)}
  <div style="padding-top: 1rem;">
    <span style="font-size: larger; font-weight: bold;">Errors</span>
    <ui style="color: red;">
      {#each getErrors(form) as [path, errors] (path)}
        {#each errors as error}
          <li>{error}</li>
        {/each}
      {/each}
    </ui>
  </div>
{/if}
