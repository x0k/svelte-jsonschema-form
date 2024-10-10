<script lang="ts">
  import { mount } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import Root from "./shadow-root.svelte";

  const { children, ...props }: HTMLAttributes<HTMLDivElement> = $props();

  let host: HTMLDivElement;
  let shadow: ShadowRoot;

  $effect(() => {
    shadow = host.attachShadow({ mode: "open" });
    mount(Root, { target: shadow, props: { children } });
  });
</script>

<div {...props} bind:this={host}></div>
