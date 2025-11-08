<script lang="ts">
  import { abortPrevious, createTask } from '@sjsf/form/lib/task.svelte';
  import type { ClassNameValue } from 'tailwind-merge';

  import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js'
  import { Label } from '$lib/components/ui/label/index.js';
  import { Input } from '$lib/components/ui/input/index.js';

  import type { AppContext } from './context.svelte.js';
  import type { Project } from './model.js';
  import type { BuilderState } from 'src/builder/context.svelte.js';

  const { app, project, class: className }: {
    app: AppContext,
    project: Project<BuilderState>,
    class?: ClassNameValue
  } = $props()

  let projectName = $derived(project.title)
  let isValid = $state.raw<undefined | boolean>()
  const validateName = createTask({
    combinator: abortPrevious,
    execute: (_, title: string) => app.validateProjectName(title),
    onSuccess: (result) => (isValid = result)
  })

  let open = $state.raw(false)
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class={buttonVariants({ variant: "ghost", className })}>
    {project.title}
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Edit project</Dialog.Title>
    </Dialog.Header>
      <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="name" class="text-right">Name</Label>
        <Input
          id="name"
          aria-invalid={isValid === false}
          bind:value={projectName}
          oninput={() => validateName.run(projectName)}
          class="col-span-3"
        />
      </div>
    </div>
    <Dialog.Footer>
      <Button
        disabled={isValid !== true || !validateName.isSuccess}
      >
        Save
      </Button>
      <Button variant="destructive">
        Delete
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

