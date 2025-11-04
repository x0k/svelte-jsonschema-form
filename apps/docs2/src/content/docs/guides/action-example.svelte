<script lang="ts">
  import type { Ref } from '@sjsf/form/lib/svelte.svelte';
  import {
    Content,
    createForm,
    setFormContext,
    type Config,
    type FieldErrors,
    type FormState
  } from '@sjsf/form';

  import * as defaults from "@/lib/form/defaults";

  const form = createForm({
    ...defaults,
    schema: { type: "number" },
    uiSchema: {
      'ui:options': {
        title: "Number",
        action: randomInt
      }
    }
  })
  setFormContext(form)
</script>

{#snippet randomInt(_ctx: FormState<unknown>, _config: Config, valueRef: Ref<unknown>, _errors: FieldErrors)}
    <button type="button" onclick={() => {
      valueRef.current = Math.floor(Math.random() * 100)
    }}>
      Random
    </button>
{/snippet}

<Content />
