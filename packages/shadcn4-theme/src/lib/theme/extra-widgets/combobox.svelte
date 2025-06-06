<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { Command } from 'bits-ui';
	import '@sjsf/form/fields/extra-widgets/combobox';

	import type { ButtonProps } from '../types/button.js';
	import '../types/popover';

	declare module '@sjsf/form' {
		interface UiOptions {
			shadcn4ComboboxTrigger?: ButtonProps;
			shadcn4ComboboxInput?: Command.InputProps;
			shadcn4ComboboxEmptyText?: string;
		}
	}

	declare module '../context.js' {
		interface ThemeComponents {
			Command: Component<Command.RootProps, {}, 'ref' | 'value'>;
			CommandInput: Component<Command.InputProps, {}, 'ref' | 'value'>;
			CommandList: Component<Command.ListProps, {}, 'ref'>;
			CommandEmpty: Component<Command.EmptyProps, {}, 'ref'>;
			CommandGroup: Component<Command.GroupProps, {}, 'ref'>;
			CommandItem: Component<Command.ItemProps, {}, 'ref'>;
		}
	}
</script>

<script lang="ts">
	import { tick } from 'svelte';

	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import {
		getFormContext,
		inputAttributes,
		retrieveUiOption,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';
	import { indexMapper, singleOption } from '@sjsf/form/options.svelte';

	import { cn } from '$lib/utils.js';

	import { getThemeContext } from '../context.js';

	const ctx = getFormContext();
	const themeCtx = getThemeContext();

	const {
		Popover,
		PopoverContent,
		PopoverTrigger,
		Button,
		CommandInput,
		Command,
		CommandList,
		CommandEmpty,
		CommandGroup,
		CommandItem
	} = $derived(themeCtx.components);

	let {
		value = $bindable(),
		config,
		handlers,
		options
	}: ComponentProps['comboboxWidget'] = $props();

	const mapped = $derived(
		singleOption({
			mapper: () => indexMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	);

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	const attributes = $derived(inputAttributes(ctx, config, 'shadcn4ComboboxInput', handlers, {}));

	const triggerContent = $derived(
		options[Number(mapped.value)]?.label ?? attributes.placeholder ?? ''
	);

	const emptyText = $derived(retrieveUiOption(ctx, config, 'shadcn4ComboboxEmptyText'));
</script>

<Popover bind:open>
	<PopoverTrigger class="w-full justify-between" bind:ref={triggerRef} disabled={ctx.disabled}>
		{#snippet child({ props })}
			<Button
				{...uiOptionProps('shadcn4ComboboxTrigger')(
					{
						variant: 'outline',
						...props,
						role: 'combobox',
						'aria-expanded': open
					},
					config,
					ctx
				)}
			>
				{triggerContent}
				<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</PopoverTrigger>
	<PopoverContent class="w-[200px] p-0">
		<Command>
			<CommandInput {...attributes} />
			<CommandList>
				{#if emptyText}
					<CommandEmpty>{emptyText}</CommandEmpty>
				{/if}
				<CommandGroup>
					{#each options as option, index (option.id)}
						<CommandItem
							value={option.label}
							onSelect={() => {
								mapped.value = index;
								closeAndFocusTrigger();
							}}
							disabled={option.disabled}
						>
							<Check class={cn('mr-2 size-4', index !== mapped.value && 'text-transparent')} />
							{option.label}
						</CommandItem>
					{/each}
				</CommandGroup>
			</CommandList>
		</Command>
	</PopoverContent>
</Popover>
