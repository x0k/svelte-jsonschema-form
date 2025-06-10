<script lang="ts">
  import type { Icons } from "@sjsf/form";
  import { icons as radix } from "@sjsf/radix-icons";
  import { icons as lucide } from "@sjsf/lucide-icons";
  import { icons as flowbite } from "@sjsf/flowbite-icons";
  import { icons as moving } from "@sjsf/moving-icons";
  import { AllIcons } from "testing/demo";

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
