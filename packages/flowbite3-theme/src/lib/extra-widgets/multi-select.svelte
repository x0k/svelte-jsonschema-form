<script lang="ts" module>
	import type { MultiSelectProps } from 'flowbite-svelte';
	import '@sjsf/form/fields/extra-widgets/multi-select';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3MultiSelect?: Omit<MultiSelectProps<number>, 'value'>;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, selectAttributes, type ComponentProps } from '@sjsf/form';
	import { multipleOptions, indexMapper } from '@sjsf/form/options.svelte';
	import MultiSelect from 'flowbite-svelte/MultiSelect.svelte';

	let {
		handlers,
		value = $bindable(),
		options,
		config
	}: ComponentProps['multiSelectWidget'] = $props();

	const ctx = getFormContext();

	const mapped = $derived(
		multipleOptions({
			mapper: () => indexMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	);

	const selectOptions = $derived(
		options.map((option, i) => ({
			value: i,
			name: option.label,
			disabled: option.disabled
		}))
	);
</script>

<MultiSelect
	class="grow"
	bind:value={mapped.value}
	{...selectAttributes(ctx, config, 'flowbite3MultiSelect', handlers, {
		items: selectOptions
	})}
/>
