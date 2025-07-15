<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";

  import type { NodeOption } from "$lib/builder/node-props.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    options: NodeOption[];
    value: string;
    onEnter?: () => void;
  }

  let { value = $bindable(), options, onEnter }: Props = $props();

  let open = $state(false);
  let inputValue = $state("");
  let triggerRef = $state<HTMLButtonElement>(null!);
  let inputRef = $state<HTMLInputElement>(null!);

  export function focus() {
    inputValue = "";
    triggerRef?.click();
    inputRef?.focus();
  }

  const selectedValue = $derived(options.find((o) => o.value === value)?.label);
</script>

{#if options.length > 0}
  <Popover.Root bind:open>
    <Popover.Trigger bind:ref={triggerRef}>
      {#snippet child({ props })}
        <Button
          {...props}
          variant="outline"
          class="flex-1 justify-between"
          role="combobox"
          aria-expanded={open}
        >
          {selectedValue ?? "Select some option"}
          <ChevronsUpDownIcon class="opacity-50" />
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="p-0" portalProps={{ disabled: true }}>
      <Command.Root>
        <Command.Input
          bind:value={inputValue}
          placeholder="Select some option"
        />
        <Command.List>
          <Command.Empty>No option found.</Command.Empty>
          <Command.Group value="options">
            {#each options as option (option.id)}
              <Command.Item
                value={option.value}
                onSelect={() => {
                  value = option.value;
                  open = false;
                  onEnter?.();
                }}
              >
                <CheckIcon
                  class={cn(value !== option.value && "text-transparent")}
                />
                {option.label}
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.List>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
{:else}
  <Input
    bind:ref={inputRef}
    placeholder="Input JSON value"
    bind:value
    onkeydown={(e) => {
      if (e.code === "Enter") {
        e.preventDefault();
        onEnter?.();
      }
    }}
  />
{/if}
