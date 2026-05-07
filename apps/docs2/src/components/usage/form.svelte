<script lang="ts">
  import type { Component } from "svelte";

  import type { ActualTheme } from "@/shared";

  import Basic from "./basic/wrapper.svelte";
  import Daisyui5 from "./daisyui/wrapper.svelte";
  import Flowbite3 from "./flowbite/wrapper.svelte";
  import Shadcn4 from "./shadcn4/wrapper.svelte";
  import Skeleton4 from "./skeleton4/wrapper.svelte";

  let { theme }: { theme: ActualTheme } = $props();

  const ThemeForm = (
    {
      basic: Basic,
      daisyui5: Daisyui5,
      flowbite3: Flowbite3,
      shadcn4: Shadcn4,
      skeleton4: Skeleton4,
    } satisfies Record<ActualTheme, Component>
  )[theme];
</script>

<ThemeForm />
<div>
  <style>
    .demo-container {
      display: grid;
      grid-template-columns: 2fr 1fr;
      align-items: stretch;
      gap: 1rem;
    }
    @media (max-width: 1080px) {
      .demo-container {
        grid-template-columns: 1fr;
      }
    }
    .demo-container > pre {
      overflow: auto;
      display: flex;
      align-items: center;
    }
  </style>
</div>