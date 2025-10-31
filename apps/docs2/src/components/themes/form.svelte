<script lang="ts">
  import type { Component } from "svelte";

  import type { ActualTheme } from "@/shared";

  import Basic from "./basic/form.svelte";
  import Daisyui5 from "./daisyui/form.svelte";
  import Flowbite3 from "./flowbite/form.svelte";
  import Shadcn4 from "./shadcn4/wrapper.svelte";
  import Skeleton4 from "./skeleton4/form.svelte";

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
