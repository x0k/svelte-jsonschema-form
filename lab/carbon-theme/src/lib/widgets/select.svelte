<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { Select as SvarSelect } from '@svar-ui/svelte-core';

	declare module '@sjsf/form' {
		interface UiOptions {
			savrSelect?: SvelteComponentProps<typeof SvarSelect>;
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
		options,
		config,
		errors,
		handlers
	}: ComponentProps['selectWidget'] = $props();

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
		uiOptionProps('savrSelect')(
			{ id, disabled: isDisabled(ctx), error: errors.length > 0, onchange },
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

<SvarSelect options={items} bind:value={mapped.current} {...attributes} />
