<script lang="ts" module>
	import type { Component } from 'svelte';
	import type {
		RadioGroup,
		RadioGroupItemProps,
		RadioGroupRootProps,
		WithoutChildrenOrChild
	} from 'bits-ui';
	import '@sjsf/form/fields/extra-widgets/radio';

	import '../types/label';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcnRadioGroup?: WithoutChildrenOrChild<RadioGroupRootProps>;
			shadcnRadioItem?: Omit<WithoutChildrenOrChild<RadioGroupItemProps>, 'value'>;
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
		type ComponentProps,
		getFormContext,
		retrieveInputAttributes,
		retrieveUiProps
	} from '@sjsf/form';
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

	const attributes = $derived(
		retrieveInputAttributes(ctx, config, 'shadcnRadioGroup', () => ({
			onValueChange: handlers.onchange
		}))
	);

	const itemAttributes = $derived(
		retrieveUiProps(ctx, config, 'shadcnRadioItem', {
			onclick: handlers.oninput,
			onblur: handlers.onblur
		})
	);
</script>

<RadioGroup bind:value={mapped.value} {...attributes}>
	{#each options as option, index (option.id)}
		{@const indexStr = index.toString()}
		<div class="flex items-center space-x-2">
			<RadioGroupItem
				{...itemAttributes}
				value={indexStr}
				id={option.id}
				disabled={option.disabled}
			/>
			<Label for={option.id}>{option.label}</Label>
		</div>
	{/each}
</RadioGroup>
