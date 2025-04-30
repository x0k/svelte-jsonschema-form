<script lang="ts" module>
	import { type RangeProps } from 'flowbite-svelte';
	import '@sjsf/form/fields/extra-widgets/range';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Range?: RangeProps;
		}
	}
</script>

<script lang="ts">
	import {
		getFormContext,
		inputAttributes,
		retrieveInputAttributes,
		type ComponentProps
	} from '@sjsf/form';
	import Range from 'flowbite-svelte/Range.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['rangeWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveInputAttributes(ctx, config, 'flowbite3Range', inputAttributes(handlers))
	);
</script>

<Range bind:value={() => value ?? 0, (v) => (value = v)} {...attributes} />
