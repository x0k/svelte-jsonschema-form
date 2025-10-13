<script lang="ts" module>
	import type { Component } from 'svelte';
	import type {
		RadioGroup,
		RadioGroupItemProps,
		RadioGroupRootProps,
		WithoutChildrenOrChild
	} from 'bits-ui';
	import '@sjsf/form/fields/extra-widgets/radio';

	import '../types/label.js';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcn4RadioGroup?: WithoutChildrenOrChild<RadioGroupRootProps>;
			shadcn4RadioItem?: Omit<WithoutChildrenOrChild<RadioGroupItemProps>, 'value'>;
		}
	}

	declare module '../context.js' {
		interface ThemeComponents {
			RadioGroup: Component<RadioGroup.RootProps, {}, 'value' | 'ref'>;
			RadioGroupItem: Component<WithoutChildrenOrChild<RadioGroup.ItemProps>>;
		}
	}
</script>

<script lang="ts">
	import {
		ariaInvalidProp,
		type ComponentProps,
		composeProps,
		customInputAttributes,
		getFormContext,
		uiOptionProps
	} from '@sjsf/form';
	import { stringIndexMapper, singleOption } from '@sjsf/form/options.svelte';

	import { getThemeContext } from '../context.js';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const { RadioGroup, RadioGroupItem, FieldLabel } = $derived(themeCtx.components);

	let { config, handlers, value = $bindable(), options }: ComponentProps['radioWidget'] = $props();

	const mapped = singleOption({
		mapper: () => stringIndexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const attributes = $derived(
		customInputAttributes(ctx, config, 'shadcn4RadioGroup', {
			onValueChange: handlers.onchange
		})
	);

	const itemAttributes = $derived(
		composeProps(
			ctx,
			config,
			{
				onclick: handlers.oninput,
				onblur: handlers.onblur
			},
			uiOptionProps('shadcn4RadioItem'),
			ariaInvalidProp
		)
	);
</script>

<RadioGroup bind:value={mapped.value} {...attributes}>
	{#each options as option, index (option.id)}
		{@const indexStr = index.toString()}
		<div class="flex items-center space-x-3">
			<RadioGroupItem
				{...itemAttributes}
				value={indexStr}
				id={option.id}
				disabled={option.disabled}
			/>
			<FieldLabel for={option.id}>{option.label}</FieldLabel>
		</div>
	{/each}
</RadioGroup>
