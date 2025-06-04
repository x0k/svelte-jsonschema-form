<script lang="ts">
  import type { Component } from "svelte";

  import type { ActualTheme } from "@/shared";

  import WithBasic from "./_with-basic.svelte";
  import WithDaisyui5 from "./_with-daisyui5.svelte";
  import WithFlowbite3 from "./_with-flowbite3.svelte";
  import WithShadcn from "./_with-shadcn4.svelte";
  import WithSkeleton3 from "./_with-skeleton3.svelte";

  let { theme }: { theme: ActualTheme } = $props();

  const ThemeForm = (
    {
      basic: WithBasic,
      daisyui5: WithDaisyui5,
      flowbite3: WithFlowbite3,
      shadcn4: WithShadcn,
      skeleton3: WithSkeleton3,
    } satisfies Record<ActualTheme, Component>
  )[theme];
</script>

<ThemeForm />
