<script lang="ts" module>
	import { noop } from '@sjsf/form/lib/function';

	export interface GenericProjectDialogOptions {
		open?: boolean;
		title: string;
		projectName: string;
		validateProjectName: (signal: AbortSignal, title: string) => Promise<boolean>;
		projectAction: (title: string) => void;
	}

	const resolvedTrue = Promise.resolve(true);
	export const DEFAULT_GENERIC_PROJECT_DIALOG_OPTIONS: GenericProjectDialogOptions = {
		title: '',
		projectName: '',
		validateProjectName: () => resolvedTrue,
		projectAction: noop
	};
</script>

<script lang="ts">
	import { abortPrevious, createTask } from '@sjsf/form/lib/task.svelte';

	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let {
		open = $bindable(),
		title,
		projectName,
		validateProjectName,
		projectAction
	}: GenericProjectDialogOptions = $props();

	let isValid = $state.raw<undefined | boolean>();
	const validateName = createTask<[string], boolean>({
		combinator: abortPrevious,
		// WARN: Do not optimize next line, breaks reactivity
		execute: (s, title) => validateProjectName(s, title),
		onSuccess: (result) => (isValid = result)
	});

	$effect(() => {
		if (open) {
			validateName.run(projectName)
		}
	})
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
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
				onclick={() => projectAction(projectName)}
			>
				Create
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
