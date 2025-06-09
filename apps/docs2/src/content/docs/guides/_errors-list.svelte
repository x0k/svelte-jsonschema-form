<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";

  import * as defaults from "@/components/form-defaults";

  import { objectSchema } from "./_demo-schemas";

  const form = createForm({
    ...defaults,
    schema: objectSchema,
  });
</script>

<BasicForm {form} novalidate />

{#if form.errors.size > 0}
  <div style="padding-top: 1rem;">
    <span style="font-size: larger; font-weight: bold;">Errors</span>
    <ui style="color: red;">
      {#each form.errors as [field, fieldErrors] (field)}
        {#each fieldErrors as err}
          <li>"{err.propertyTitle}" {err.message}</li>
        {/each}
      {/each}
    </ui>
  </div>
{/if}
