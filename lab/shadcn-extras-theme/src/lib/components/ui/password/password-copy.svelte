<script lang="ts">
	import { CopyButton } from '$lib/components/ui/copy-button/index.js';
	import type { PasswordCopyButtonProps } from '$lib/components/ui/password/types.js';
	import { cn } from '$lib/utils.js';
	import { usePasswordCopy } from '$lib/components/ui/password/password.svelte.js';

	let { ref = $bindable(null), class: className, ...rest }: PasswordCopyButtonProps = $props();

	const state = usePasswordCopy();
</script>

<CopyButton
	{...rest}
	bind:ref
	text={state.root.passwordState.value}
	tabindex={-1}
	class={cn(
		'absolute top-1/2 right-0 size-9 min-w-0 -translate-y-1/2 text-muted-foreground hover:!bg-transparent',
		className
	)}
/>
