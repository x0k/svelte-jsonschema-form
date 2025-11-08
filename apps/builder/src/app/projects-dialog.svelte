<script lang="ts">
  import type { ClassNameValue } from 'tailwind-merge';
  import GitFork from '@lucide/svelte/icons/git-fork';
  import Trash from '@lucide/svelte/icons/trash-2';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import Download from '@lucide/svelte/icons/download';

  import { ButtonGroup } from '$lib/components/ui/button-group/index.js';
  import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Dialog from '$lib/components/ui/dialog/index.js'
  import * as Item from '$lib/components/ui/item/index.js'

  import type { AppContext } from './context.svelte.js';

  const { app, class: className }: { app: AppContext, class?: ClassNameValue } = $props()
</script>

<Dialog.Root onOpenChange={(open) => {
  if (open) {
    app.loadRecentProjects.run()
  }
}}>
  <Dialog.Trigger class={buttonVariants({ variant: "ghost", className })}>
    {app.currentProject?.title ?? 'Projects'}
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px] md:max-w-xl lg:max-w-2xl">
    <Dialog.Header>
      <Dialog.Title>Projects</Dialog.Title>
    </Dialog.Header>
    <div class="py-4">
      <Item.Group>
      {#each app.recentProjects as p, i (p.id)}
        {#if i !== 0}
          <Item.Separator />
        {/if}
        <Item.Root>
          <Item.Content>
            <Item.Title>{p.title}</Item.Title>
            <Item.Description>
              Updated at {p.updatedAt.toLocaleString()}
            </Item.Description>
          </Item.Content>
          <Item.Actions>
            <ButtonGroup>
              <Button variant="outline">Open</Button>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  {#snippet child({ props })}
                    <Button {...props} size="icon" variant="outline">
                      <ChevronDown />
                    </Button>
                  {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="w-36" align="start">
                  <DropdownMenu.Item>
                    <GitFork />
                    Fork
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    <Download />
                    Export
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item variant="destructive">
                    <Trash />
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </ButtonGroup>
          </Item.Actions>
        </Item.Root>
      {/each}
      </Item.Group>
    </div>
  </Dialog.Content>
</Dialog.Root>
