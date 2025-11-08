<script lang="ts">
  import Save from '@lucide/svelte/icons/save';
  import GitFork from '@lucide/svelte/icons/git-fork';
  import Trash from '@lucide/svelte/icons/trash-2';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import Download from '@lucide/svelte/icons/download';
  import Upload from '@lucide/svelte/icons/upload';
  
  import { ButtonGroup } from '$lib/components/ui/button-group/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  
  import type { AppContext } from './context.svelte.js';
  import CreateProjectDialog from './create-project-dialog.svelte';
  
  const { app }: { app: AppContext } = $props()
</script>

<ButtonGroup>
  {#if app.currentProject}
    <Button>
      Save
    </Button>
  {:else}
    <CreateProjectDialog {app}>
      {#snippet children({ props })}
        <Button {...props} variant="outline">
          <Save />
          Save
        </Button>
      {/snippet}
    </CreateProjectDialog>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Button {...props} size="icon" variant="outline">
            <ChevronDown />
          </Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-36" align="end">
        <DropdownMenu.Item>
          <Upload />
          Import
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  {/if}
</ButtonGroup>
