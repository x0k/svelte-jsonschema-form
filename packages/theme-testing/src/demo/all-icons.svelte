<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type {
    Config,
    FieldPath,
    IconConfig,
    Icons,
    Labels,
  } from "@sjsf/form";

  const { icons, ...rest }: { icons: Icons } & HTMLAttributes<HTMLDivElement> =
    $props();
  const config: Config = {
    path: [] as unknown as FieldPath,
    required: false,
    schema: {},
    uiSchema: {},
    title: "title",
  };
  const labels = {
    "move-array-item-up": {},
    "move-array-item-down": {},
    "remove-array-item": {},
    "copy-array-item": {},
    "remove-object-property": {},
    edit: {},
    clear: {},
  } satisfies Partial<Labels>;
</script>

<div
  style="height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center"
  {...rest}
>
  <div style="display: flex; flex-direction: column; gap: 1rem">
    {#each Object.entries(labels) as [key, params]}
      {@const label = key as keyof typeof labels}
      {@const iconConfig: {
				[L in keyof typeof labels]:	IconConfig<L>
			}[keyof typeof labels] = {
          config,
          translation: "",
          params,
        }}
      <button
        style="display: flex; gap: 0.5rem; align-items: center; height: 2rem"
      >
        {@render icons(label, iconConfig)?.(iconConfig as any)}
        {key}
      </button>
    {/each}
  </div>
</div>
