<script lang="ts" module>
	import type { Component } from 'svelte';
	import type { Command } from 'bits-ui';
	import '@sjsf/form/fields/extra-widgets/combobox';

	import type { ButtonProps } from '../types/button.js';
	import '../types/popover.js';

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
	import {
		ariaInvalidProp,
		composeProps,
		disabledProp,
		getFormContext,
		handlersAttachment,
		inputAttributes,
		retrieveUiOption,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';
	import { idMapper, singleOption } from '@sjsf/form/options.svelte';
	import Check from '@lucide/svelte/icons/check';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';

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

	const labels = $derived(new Map(options.map((o) => [o.id, o.label])));
	const mapped = singleOption({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	const attributes = $derived(inputAttributes(ctx, config, 'shadcn4ComboboxInput', handlers, {}));

	const triggerContent = $derived(labels.get(mapped.current) ?? attributes.placeholder);

	const emptyText = $derived(retrieveUiOption(ctx, config, 'shadcn4ComboboxEmptyText'));

	const { oninput, onchange, ...buttonHandlers } = $derived(handlers);
</script>

<Popover bind:open>
	<PopoverTrigger
		class="w-full justify-between"
		bind:ref={triggerRef}
		{...disabledProp({}, config, ctx)}
	>
		{#snippet child({ props })}
			<Button
				{...composeProps(
					ctx,
					config,
					{
						variant: 'outline',
						...props,
						role: 'combobox',
						'aria-expanded': open
					} satisfies ButtonProps,
					uiOptionProps('shadcn4ComboboxTrigger'),
					handlersAttachment(buttonHandlers),
					ariaInvalidProp
				)}
			>
				<span>
					{triggerContent}
				</span>
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
					{#each options as option (option.id)}
						<CommandItem
							value={option.label}
							onSelect={() => {
								mapped.current = option.id;
								oninput?.();
								onchange?.();
								closeAndFocusTrigger();
							}}
							disabled={option.disabled}
						>
							<Check class={cn('mr-2 size-4', mapped.current !== option.id && 'text-transparent')} />
							{option.label}
						</CommandItem>
					{/each}
				</CommandGroup>
			</CommandList>
		</Command>
	</PopoverContent>
</Popover>
