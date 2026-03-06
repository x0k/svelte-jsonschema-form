<script lang="ts">
  import { mount, unmount, type Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import Root from "./root.svelte";

  const {
    children,
    style,
    ...props
  }: Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
    children: Snippet<[ShadowRoot]>;
  } = $props();

  let host: HTMLDivElement;
  let shadowRoot: ShadowRoot;

  $effect(() => {
    shadowRoot = host.attachShadow({ mode: "open" });
  });

  $effect(() => {
    const root = mount(Root, {
      target: shadowRoot,
      props: { children, shadowRoot },
    });
    let styleElement: HTMLStyleElement | undefined;
    if (style) {
      styleElement = document.createElement("style");
      styleElement.textContent = style;
      shadowRoot.appendChild(styleElement);
    }
    return () => {
      styleElement?.remove();
      unmount(root);
    };
  });
</script>

<div {...props} bind:this={host}></div>
