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
	import { idMapper, singleOption, UNDEFINED_ID } from '@sjsf/form/options.svelte';

	let {
		value = $bindable(),
		config,
		handlers,
		options,
		errors
	}: ComponentProps['comboboxWidget'] = $props();

	const ctx = getFormContext();

	const id = $derived(getId(ctx, config.path));

	const mapped = singleOption({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	function onchange() {
		handlers.oninput?.();
		handlers.onchange?.();
	}

	const { placeholder = '', ...attributes } = $derived(
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

	const items = $derived(
		config.schema.default === undefined
			? [{ id: UNDEFINED_ID, label: placeholder }, ...options]
			: options
	);
</script>

<Combo options={items} bind:value={mapped.value} {...attributes} />
