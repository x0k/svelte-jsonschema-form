<script lang="ts" module>
	import type { MultiSelectProps } from 'flowbite-svelte/MultiSelect.svelte';
	import type { SchemaArrayValue } from '@sjsf/form/core';
	import type { WidgetCommonProps, Options } from '@sjsf/legacy-fields/widgets';

	declare module '@sjsf/form' {
		interface ComponentProps {
			flowbiteMultiSelectWidget: WidgetCommonProps<SchemaArrayValue> & Options;
		}
		interface ComponentBindings {
			flowbiteMultiSelectWidget: 'value';
		}
		interface UiOptions {
			flowbiteMultiSelect?: MultiSelectProps;
		}
	}
</script>

<script lang="ts">
	import {
		defineDisabled,
		getFormContext,
		selectAttributes,
		type ComponentProps
	} from '@sjsf/form';
	import { multipleOptions, indexMapper } from '@sjsf/form/options.svelte';
	import MultiSelect from 'flowbite-svelte/MultiSelect.svelte';

	let {
		handlers,
		value = $bindable(),
		options,
		config
	}: ComponentProps['flowbiteMultiSelectWidget'] = $props();

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

<MultiSelect class="grow" bind:value={mapped.value} items={selectOptions} {...attributes} />
