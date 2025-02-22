<script lang="ts" module>
	import type { CheckboxRootProps } from 'bits-ui';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnCheckboxes?: CheckboxRootProps;
		}
	}
</script>

<script lang="ts">
	import { defineDisabled, getFormContext, type ComponentProps } from '@sjsf/form';
	import { multipleOptions, stringIndexMapper } from '@sjsf/form/options.svelte';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();

	const themeCtx = getThemeContext();

	const { Checkbox, Label } = $derived(themeCtx.components);

	let {
		value = $bindable(),
		options,
		config,
		handlers
	}: ComponentProps['checkboxesWidget'] = $props();

	const mapped = multipleOptions({
		mapper: () => stringIndexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const indexes = $derived(new Set(mapped.value));

	const attributes = $derived(
		defineDisabled(ctx, {
			name: config.id,
			required: config.required,
			...handlers,
			...config.uiOptions?.shadcnCheckboxes
		} satisfies CheckboxRootProps)
	);
</script>

{#each options as option, index (option.id)}
	{@const indexStr = index.toString()}
	<div class="flex items-center space-x-2">
		<Checkbox
			checked={indexes.has(indexStr)}
			value={indexStr}
			onCheckedChange={(v) => {
				mapped.value = v
					? mapped.value.concat(indexStr)
					: mapped.value.filter((index) => index !== indexStr);
			}}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
		<Label for={option.id}>{option.label}</Label>
	</div>
{/each}
