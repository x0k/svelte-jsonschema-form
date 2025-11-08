<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassNameValue } from 'tailwind-merge';
  import { abortPrevious, createTask } from '@sjsf/form/lib/task.svelte';

  import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js'
  import { Label } from '$lib/components/ui/label/index.js';
  import { Input } from '$lib/components/ui/input/index.js';

  import type { AppContext } from './context.svelte.js';

  const { app, class: className, children }: { app: AppContext, children: Snippet<[{ props: Record<string, unknown> }]>, class?: ClassNameValue } = $props()

  let projectName = $state("New project")
  let isValid = $state.raw<undefined | boolean>()
  const validateName = createTask({
    combinator: abortPrevious,
    execute: (_, title: string) => app.validateProjectName(title),
    onSuccess: (result) => (isValid = result)
  })

  let open = $state.raw(false)
</script>

<Dialog.Root bind:open onOpenChange={(open) => {
  if (open) {
    validateName.run(projectName)
  }
}} >
  <Dialog.Trigger class={buttonVariants({ variant: "ghost", className })} child={children} />
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Create project</Dialog.Title>
    </Dialog.Header>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input
            aria-invalid={isValid === false}
            id="name"
            bind:value={projectName}
            oninput={() => validateName.run(projectName)}
            class="col-span-3"
          />
        </div>
      </div>
    <Dialog.Footer>
      <Button
        disabled={isValid !== true || !validateName.isSuccess}
        onclick={() => {
          app.createProject.runAsync(projectName).then(
            () => (open = false),
            console.error
          )
        }}
      >
        Create
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
