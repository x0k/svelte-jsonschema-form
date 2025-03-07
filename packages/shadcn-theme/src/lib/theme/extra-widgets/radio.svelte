<script lang="ts" module>
	import type { RadioGroupItemProps, RadioGroupRootProps, WithoutChildrenOrChild } from 'bits-ui';
	import '@sjsf/form/fields/extra-widgets/radio';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnRadioGroup?: WithoutChildrenOrChild<RadioGroupRootProps>;
			shadcnRadioItem?: Omit<WithoutChildrenOrChild<RadioGroupItemProps>, 'value'>;
		}
	}
</script>

<script lang="ts">
	import { type ComponentProps, defineDisabled, getFormContext } from '@sjsf/form';
	import { stringIndexMapper, singleOption } from '@sjsf/form/options.svelte';

	import { getThemeContext } from '../context';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { RadioGroup, RadioGroupItem, Label } = $derived(themeCtx.components);

	let { config, handlers, value = $bindable(), options }: ComponentProps['radioWidget'] = $props();

	const mapped = singleOption({
		mapper: () => stringIndexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const attributes = $derived.by(() => {
		const props: RadioGroupRootProps = {
			onValueChange: handlers.onchange,
			...config.uiOptions?.shadcnRadioGroup
		};
		return defineDisabled(ctx, props);
	});
</script>

<RadioGroup bind:value={mapped.value} {...attributes}>
	{#each options as option, index (option.id)}
		{@const indexStr = index.toString()}
		<div class="flex items-center space-x-2">
			<RadioGroupItem
				value={indexStr}
				onclick={handlers.oninput}
				onblur={handlers.onblur}
				{...config.uiOptions?.shadcnRadioItem}
				id={option.id}
				disabled={option.disabled}
			/>
			<Label for={option.id}>{option.label}</Label>
		</div>
	{/each}
</RadioGroup>
