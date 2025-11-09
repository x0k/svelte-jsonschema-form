<script lang="ts" module>
	import { noop } from '@sjsf/form/lib/function';

	import type { ButtonVariant } from '$lib/components/ui/button/index.js';

	export interface ConfirmationDialogOptions {
		open?: boolean;
		title: string;
		description?: string;
		confirm?: string;
		variant?: ButtonVariant;
		onConfirm: () => void;
	}

	export const DEFAULT_CONFIRMATION_DIALOG_OPTIONS: ConfirmationDialogOptions = {
		title: '',
		onConfirm: noop
	};
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let {
		open = $bindable(),
		title,
		description,
		onConfirm,
		confirm = 'Confirm',
		variant = 'default'
	}: ConfirmationDialogOptions = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			{#if description}
				<Dialog.Description>
					{description}
				</Dialog.Description>
			{/if}
		</Dialog.Header>
		<Dialog.Footer>
			<Button
				{variant}
				onclick={() => {
					onConfirm();
					open = false;
				}}>{confirm}</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
