<script lang="ts" module>
	import type { ComboboxRootProps, PortalRootProps } from '@skeletonlabs/skeleton-svelte';
	import '@sjsf/form/fields/extra-widgets/combobox';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton4Combobox?: ComboboxRootProps;
			skeleton4ComboboxPortal?: Omit<PortalRootProps, 'children'>;
		}
	}
</script>

<script lang="ts">
	import {
		customInputAttributes,
		getFormContext,
		getId,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';
	import { multipleOptions, idMapper } from '@sjsf/form/options.svelte';
	import { Combobox, Portal, useListCollection } from '@skeletonlabs/skeleton-svelte';

	let {
		config,
		handlers,
		options,
		value = $bindable()
	}: ComponentProps['comboboxWidget'] = $props();

	const ctx = getFormContext();

	const mapped = multipleOptions({
		mapper: () => idMapper(options),
		value: () => (value === undefined ? undefined : [value]),
		update: (v) => (value = v[0])
	});

	const originalItems = $derived(
		options.map((o) => ({ disabled: o.disabled, label: o.label, value: o.id }))
	);

	let items = $derived(originalItems);

	const collection = $derived(
		useListCollection({
			items: items,
			isItemDisabled: (item) => item.disabled,
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value
		})
	);

	const id = $derived(getId(ctx, config.path));

	const attributes = $derived(
		customInputAttributes(ctx, config, 'skeleton4Combobox', {
			ids: {
				input: id
			},
			name: id,
			required: config.required,
			readOnly: config.schema.readOnly,
			collection,
			onFocusOutside: handlers.onblur,
			onOpenChange: () => {
				items = originalItems;
			},
			onInputValueChange: (event) => {
				const input = event.inputValue.toLowerCase().trim();
				const filtered = originalItems.filter((item) => item.label.toLowerCase().includes(input));
				if (filtered.length > 0) {
					items = filtered;
				} else {
					items = originalItems;
				}
			},
			onValueChange: (details) => {
				mapped.current = details.value;
				handlers.oninput?.();
				handlers.onchange?.();
			}
		})
	);
</script>

<Combobox class="w-full" value={mapped.current} {...attributes}>
	<Combobox.Control>
		<Combobox.Input />
		<Combobox.Trigger />
	</Combobox.Control>
	<Portal {...uiOptionProps('skeleton4ComboboxPortal')({}, config, ctx)}>
		<Combobox.Positioner class="z-1!">
			<Combobox.Content>
				{#each items as item (item.value)}
					<Combobox.Item {item}>
						<Combobox.ItemText>{item.label}</Combobox.ItemText>
						<Combobox.ItemIndicator />
					</Combobox.Item>
				{/each}
			</Combobox.Content>
		</Combobox.Positioner>
	</Portal>
</Combobox>
