<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { Combobox as SkeletonCombobox } from '@skeletonlabs/skeleton-svelte';
	import '@sjsf/form/fields/extra-widgets/combobox';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton3Combobox?: SvelteComponentProps<typeof SkeletonCombobox>;
		}
	}
</script>

<script lang="ts">
	import { customInputAttributes, getFormContext, getId, type ComponentProps } from '@sjsf/form';
	import { multipleOptions, idMapper } from '@sjsf/form/options.svelte';

	let {
		config,
		handlers,
		options,
		value = $bindable()
	}: ComponentProps['comboboxWidget'] = $props();

	const ctx = getFormContext();

	const data = $derived(options.map((o) => ({ label: o.label, value: o.id })));

	const mapped = multipleOptions({
		mapper: () => idMapper(options),
		value: () => (value === undefined ? undefined : [value]),
		update: (v) => (value = v[0])
	});

	const id = $derived(getId(ctx, config.path));

	const attributes = $derived(
		customInputAttributes(ctx, config, 'skeleton3Combobox', {
			ids: {
				input: id
			},
			name: id,
			required: config.required,
			readOnly: config.schema.readOnly,
			onFocusOutside: handlers.onblur,
			onValueChange: (details) => {
				mapped.value = details.value;
				handlers.oninput?.();
				handlers.onchange?.();
			}
		})
	);
</script>

<SkeletonCombobox classes="w-full" {data} value={mapped.value} {...attributes} />
