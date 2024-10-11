<script lang="ts">
  import { mount, unmount } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import Root from "./shadow-root.svelte";

  const { children, style, ...props }: HTMLAttributes<HTMLDivElement> =
    $props();

  let host: HTMLDivElement;
  let shadow: ShadowRoot;

  $effect(() => {
    shadow = host.attachShadow({ mode: "open" });
  });

  $effect(() => {
    mount(Root, { target: shadow, props: { children } });
    if (style) {
      const styleElement = document.createElement("style");
      styleElement.textContent = style;
      shadow.appendChild(styleElement);
    }
    // Looks like we don't need to unmount
    // return () => {
    //   unmount(shadow);
    // };
  });
</script>

<div {...props} bind:this={host}></div>
