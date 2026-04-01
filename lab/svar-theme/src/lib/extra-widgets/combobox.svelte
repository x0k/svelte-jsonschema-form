<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { Combo } from '@svar-ui/svelte-core';
	import '@sjsf/form/fields/extra-widgets/combobox';

	declare module '@sjsf/form' {
		interface UiOptions {
			svarCombobox?: SvelteComponentProps<typeof Combo>;
		}
	}
</script>

<script lang="ts">
	import {
		getFormContext,
		getId,
		isDisabled,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';
	import { idMapper, singleOption, EMPTY_VALUE } from '@sjsf/form/options.svelte';

	let {
		value = $bindable(),
		config,
		handlers,
		options,
		errors,
		mapped = singleOption({
			mapper: () => idMapper(options),
			value: () => value,
			update: (v) => (value = v)
		}),
		hasInitialValue = config.schema.default !== undefined
	}: ComponentProps['comboboxWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));

	function onchange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}

	const { placeholder = ' ', ...attributes } = $derived(
		uiOptionProps('svarCombobox')(
			{
				id,
				disabled: isDisabled(ctx),
				error: errors.length > 0,
				onchange
			},
			config,
			ctx
		)
	);

	const mappedOptions = $derived.by(() => {
		const items: { id: string; label: string }[] = [];
		if (!hasInitialValue) {
			items.push({ id: EMPTY_VALUE, label: placeholder });
		}
		for (const o of options) {
			items.push({ id: o.mappedValue ?? o.id, label: o.label });
		}
		return items;
	});
</script>

<Combo options={mappedOptions} bind:value={mapped.current} {...attributes} />
