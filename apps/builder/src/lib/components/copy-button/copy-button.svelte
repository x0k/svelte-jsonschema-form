<script lang="ts">
  import { scale } from "svelte/transition";
  import XIcon from "@lucide/svelte/icons/x";
  import CheckIcon from "@lucide/svelte/icons/check";
  import CopyIcon from "@lucide/svelte/icons/copy";

  import { copyTextToClipboard } from "$lib/copy-to-clipboard.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  import type { CopyButtonProps } from "./types.js";

  let {
    ref = $bindable(null),
    text,
    icon,
    animationDuration = 500,
    variant = "ghost",
    size = "icon",
    onCopy,
    class: className,
    tabindex = 0,
    children,
  }: CopyButtonProps = $props();

  // this way if the user passes text then the button will be the default size
  if (size === "icon" && children) {
    size = "default";
  }

  let status = $state.raw<"success" | "failure" | "idle">("idle");
  let callbackId: number
</script>

<Button
  bind:ref
  {variant}
  {size}
  {tabindex}
  class={cn("flex items-center gap-2", className)}
  type="button"
  name="copy"
  onclick={() => {
    copyTextToClipboard(text())
      .then(
        () => {
          status = "success";
        },
        () => {
          status = "failure";
        }
      )
      .finally(() => {
        onCopy?.(status);
        clearTimeout(callbackId);
        callbackId = setTimeout(() => {
          status = "idle";
        }, animationDuration);
      });
  }}
>
  {@render children?.()}
  {#if status === "success"}
    <div in:scale={{ duration: animationDuration, start: 0.85 }}>
      <CheckIcon tabindex={-1} />
      <span class="sr-only">Copied</span>
    </div>
  {:else if status === "failure"}
    <div in:scale={{ duration: animationDuration, start: 0.85 }}>
      <XIcon tabindex={-1} />
      <span class="sr-only">Failed to copy</span>
    </div>
  {:else}
    <div in:scale={{ duration: animationDuration, start: 0.85 }}>
      {#if icon}
        {@render icon()}
      {:else}
        <CopyIcon tabindex={-1} />
      {/if}
      <span class="sr-only">Copy</span>
    </div>
  {/if}
</Button>
