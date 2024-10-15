<script lang="ts">
  import type { ErrorObject } from 'ajv';
  import type { Errors } from "@sjsf/form";
  import { SvelteMap } from 'svelte/reactivity';

  import { CustomForm } from "@/components/custom-form";

  import { objectSchema } from './_demo-schemas';

  let errors: Errors<ErrorObject> = $state.raw(new SvelteMap());
</script>

<CustomForm
  bind:errors
  schema={objectSchema}
  novalidate
  onSubmit={console.log}
/>
{#if errors.size > 0}
  <div style="padding-top: 1rem;">
    <span style="font-size: larger; font-weight: bold;">Errors</span>
    <ui style="color: red;">
      {#each errors as [field, fieldErrors] (field)}
        {#each fieldErrors as err}
          <li>"{err.propertyTitle}" {err.message}</li>
        {/each}
      {/each}
    </ui>
  </div>
{/if}
