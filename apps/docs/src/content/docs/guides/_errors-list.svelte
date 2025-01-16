<script lang="ts">
  import { RawForm } from "@sjsf/form";

  import { createCustomForm } from "@/components/custom-form";

  import { objectSchema } from "./_demo-schemas";

  const form = createCustomForm({
    schema: objectSchema,
  });
</script>

<RawForm {form} novalidate />

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
