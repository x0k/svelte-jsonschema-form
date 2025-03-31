<script lang="ts" module>
	import { type RangeProps } from 'flowbite-svelte';
	import '@sjsf/form/fields/extra-widgets/range';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteRange?: RangeProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import Range from 'flowbite-svelte/Range.svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['rangeWidget'] = $props();

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(ctx, config, handlers, config.uiOptions?.flowbiteRange)
	);
</script>

<Range bind:value={() => value ?? 0, (v) => (value = v)} {...attributes} />
