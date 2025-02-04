<script lang="ts">
	import { isBrowser } from '@sjsf/form/lib/env';
	import type { WidgetProps } from '@sjsf/form';

	let { value = $bindable(), ...rest }: WidgetProps<'pikadayCalendar'> = $props();

	const promise = isBrowser
		? import('./component.svelte').then((m) => m.default)
		: Promise.reject();
</script>

{#await promise then Component}
	<Component bind:value {...rest} />
{/await}
