<script lang="ts">
  import type { Icons } from "@sjsf/form";
  import { icons as radix } from "@sjsf/radix-icons";
  import "@sjsf/radix-icons/extra/clear-include.svelte"
  import "@sjsf/radix-icons/extra/edit-include.svelte"
  import { icons as lucide } from "@sjsf/lucide-icons";
  import "@sjsf/lucide-icons/extra/clear-include.svelte"
  import "@sjsf/lucide-icons/extra/edit-include.svelte"
  import { icons as flowbite } from "@sjsf/flowbite-icons";
  import "@sjsf/flowbite-icons/extra/clear-include.svelte"
  import "@sjsf/flowbite-icons/extra/edit-include.svelte"
  import { icons as moving } from "@sjsf/moving-icons";
  import "@sjsf/moving-icons/extra/clear-include.svelte"
  import "@sjsf/moving-icons/extra/edit-include.svelte"
  import { AllIcons } from "theme-testing/demo";

  import type { IconsPackage } from "@/shared";

  const { pkg }: { pkg: IconsPackage } = $props();

  const icons = {
    flowbite,
    lucide,
    moving,
    radix,
  } satisfies Record<IconsPackage, Icons>;
</script>

<AllIcons
  style="width: 100%; display: flex; align-items: center; justify-content: center"
  icons={icons[pkg]}
/>
