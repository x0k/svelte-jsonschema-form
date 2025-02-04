<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	import { browser } from '$app/environment';

	let { value = $bindable(), ...rest }: WidgetProps<'callyCalendar'> = $props();

	const promise = browser
		? import('./component.svelte').then((m) => m.default)
		: Promise.reject();
</script>

{#await promise then Component}
	<Component bind:value {...rest} />
{/await}
