<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-components/errors-list";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfErrorsList?: HTMLAttributes<HTMLUListElement>;
    }
  }
</script>

<script lang="ts">
  import {
    errorsListAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  const { errors, config }: ComponentProps["errorsList"] = $props();

  const ctx = getFormContext();
</script>

<ul
  {...errorsListAttributes(ctx, config, "stdfErrorsList", {
    class: "stdf-errors-list",
  })}
>
  {#each errors as err, i (i)}
    <li>{err}</li>
  {/each}
</ul>

<style>
  :global(.stdf-errors-list) {
    color: var(--color-error);
    list-style-position: inside;
    padding: 0;
    margin: 0;
    font-size: 0.8125rem;
  }
</style>
