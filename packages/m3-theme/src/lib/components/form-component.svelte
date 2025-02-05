<script lang="ts">
	import type { FormComponentProps } from '@sjsf/form';

	let { children, form = $bindable(), onsubmit, attributes }: FormComponentProps = $props();
</script>

<form class="form" {onsubmit} {...attributes} bind:this={form}>
	{@render children?.()}
</form>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-family: var(--m3-font-body, var(--m3-font));
	}
</style>
