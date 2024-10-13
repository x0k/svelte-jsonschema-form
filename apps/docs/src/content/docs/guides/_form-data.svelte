<script lang="ts">
  import { SvelteMap } from "svelte/reactivity";

  import type { Schema, UiSchemaRoot, Errors } from "@sjsf/form";

  import CustomForm from "@/components/custom-form.svelte";

  const schema: Schema = {
    type: "string",
    minLength: 10,
  };

  let value = $state("initial");

  let errors: Errors = $state.raw(new SvelteMap());
</script>

<CustomForm bind:value bind:errors {schema} novalidate onSubmit={console.log} />

<div>
  <pre>{JSON.stringify(
      { value, errors: Object.fromEntries(errors) },
      null,
      2
    )}</pre>
</div>
