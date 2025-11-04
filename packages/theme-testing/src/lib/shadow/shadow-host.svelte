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
    const root = mount(Root, { target: shadow, props: { children } });
    let styleElement: HTMLStyleElement | undefined;
    if (style) {
      styleElement = document.createElement("style");
      styleElement.textContent = style;
      shadow.appendChild(styleElement);
    }
    return () => {
      styleElement?.remove();
      unmount(root);
    };
  });
</script>

<div {...props} bind:this={host}></div>
