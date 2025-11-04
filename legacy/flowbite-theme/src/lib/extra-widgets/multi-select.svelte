<script lang="ts" module>
	import type { MultiSelectProps } from 'flowbite-svelte/MultiSelect.svelte';
	import '@sjsf/form/fields/extra-widgets/multi-select';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteMultiSelect?: MultiSelectProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, selectAttributes, type ComponentProps } from '@sjsf/form';
	import { multipleOptions, idMapper } from '@sjsf/form/options.svelte';
	import MultiSelect from 'flowbite-svelte/MultiSelect.svelte';

	let {
		handlers,
		value = $bindable(),
		options,
		config
	}: ComponentProps['multiSelectWidget'] = $props();

	const ctx = getFormContext();

	const mapped = multipleOptions({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const selectOptions = $derived(
		options.map((option) => ({
			value: option.id,
			name: option.label,
			disabled: option.disabled
		}))
	);
</script>

<MultiSelect
	class="grow"
	bind:value={mapped.value}
	{...selectAttributes(ctx, config, 'flowbiteMultiSelect', handlers, {
		items: selectOptions
	})}
/>
