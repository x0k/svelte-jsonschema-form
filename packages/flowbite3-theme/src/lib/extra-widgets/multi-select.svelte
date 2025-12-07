<script lang="ts" module>
	import type { MultiSelectProps } from 'flowbite-svelte/types';
	import '@sjsf/form/fields/extra-widgets/multi-select';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3MultiSelect?: Omit<MultiSelectProps<string>, 'value'>;
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
	bind:value={mapped.current}
	{...selectAttributes(ctx, config, 'flowbite3MultiSelect', handlers, {
		items: selectOptions,
		onchange: () => {
			handlers.oninput?.();
			handlers.onchange?.();
		}
	})}
/>
