<script lang="ts" module>
	import type { MultiSelectProps } from 'flowbite-svelte';
	import '@sjsf/form/fields/extra-widgets/multi-select';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteMultiSelect?: MultiSelectProps<number>;
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

	const attributes = $derived(
		selectAttributes(ctx, config, handlers, config.uiOptions?.flowbiteMultiSelect)
	);
</script>

<!-- TODO: this should be `bind:value=` but lib is broken -->
<MultiSelect class="grow" value={mapped.value} items={selectOptions} {...attributes} />
