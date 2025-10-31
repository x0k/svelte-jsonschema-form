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

	let { value = $bindable(), options, config, errors }: ComponentProps['selectWidget'] = $props();

	const ctx = getFormContext();

	const mapped = $derived(
		singleOption({
			mapper: () => idMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	);
	const id = $derived(getId(ctx, config.path));
	const { placeholder = '', ...attributes } = $derived(
		uiOptionProps('savrSelect')(
			{ id, disabled: isDisabled(ctx), error: errors.length > 0 },
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

<SvarSelect options={items} bind:value={mapped.value} {...attributes} />
