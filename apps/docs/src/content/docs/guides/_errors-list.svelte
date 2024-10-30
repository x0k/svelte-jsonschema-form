<script lang="ts">
  import { SimpleForm } from "@sjsf/form";

  import { useCustomForm } from "@/components/custom-form";

  import { objectSchema } from "./_demo-schemas";

  const form = useCustomForm({
    schema: objectSchema,
    onSubmit: console.log,
  });
</script>

<SimpleForm
  {form}
  novalidate
  style="display: flex; flex-direction: column; gap: 1rem"
/>

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
