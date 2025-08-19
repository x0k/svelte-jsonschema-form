<script lang="ts">
  import type { Component } from "svelte";

  import type { ActualTheme } from "@/shared";

  import WithBasic from "./basic/form.svelte";
  import WithDaisyui5 from "./daisyui/form.svelte";
  import WithFlowbite3 from "./flowbite/form.svelte";
  import WithShadcn from "./shadcn/form.svelte";
  import WithSkeleton3 from "./skeleton/form.svelte";

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
