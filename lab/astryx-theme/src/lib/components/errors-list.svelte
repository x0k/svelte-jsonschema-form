<script lang="ts" module>
  import type { TextColorMap, TextProps } from "@astryx-svelte/core";
  import type { HTMLAttributes } from "svelte/elements";

  declare module "@astryx-svelte/core" {
    interface TextColorMap {
      error: true;
    }
  }

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the attributes of the errors list wrapper.
       */
      astryxErrorsListAttributes?: HTMLAttributes<HTMLUListElement>;
      /**
       * Overrides the Astryx Text props of each error message.
       */
      astryxErrorItemAttributes?: Partial<TextProps>;
    }
  }
</script>

<script lang="ts">
  import { Text } from "@astryx-svelte/core";
  import {
    errorsListAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/components/errors-list.svelte";

  const { errors, config }: ComponentProps["errorsList"] = $props();

  const ctx = getFormContext();

  const attrs = $derived(
    errorsListAttributes(ctx, config, "astryxErrorsListAttributes", {
      class: "sjsf-errors-list",
    })
  );
</script>

<ul {...attrs}>
  {#each errors as err, i (i)}
    <li>
      <Text type="supporting" color="error">{err}</Text>
    </li>
  {/each}
</ul>

<style>
  :global(.sjsf-errors-list) {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  :global(.sjsf-field > .sjsf-errors-list) {
    margin-top: 0.5rem;
  }
</style>
