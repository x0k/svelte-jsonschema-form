<script lang="ts">
  import type { Component } from "svelte";

  import type { Theme } from "@/shared";

  import WithBasic from "./_with-basic.svelte";
  import WithDaisyui from "./_with-daisyui.svelte";
  import WithDaisyui5 from './_with-daisyui5.svelte';
  import WithFlowbite3 from "./_with-flowbite3.svelte";
  import WithShadcn from "./_with-shadcn4.svelte";
  import WithSkeleton3 from "./_with-skeleton3.svelte";

  let { theme }: { theme: Theme } = $props();

  const ThemeForm = (
    {
      basic: WithBasic,
      daisyui: WithDaisyui,
      daisyui5: WithDaisyui5,
      flowbite: WithFlowbite3,
      flowbite3: WithFlowbite3,
      shadcn: WithShadcn,
      shadcn4: WithShadcn,
      skeleton: WithSkeleton3,
      skeleton3: WithSkeleton3,
    } satisfies Record<Theme, Component>
  )[theme];
</script>

<ThemeForm />
