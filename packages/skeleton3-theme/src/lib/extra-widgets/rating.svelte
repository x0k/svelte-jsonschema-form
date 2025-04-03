<script lang="ts" module>
	import type { ComponentProps as SvelteComponentProps } from 'svelte';
	import { Rating } from '@skeletonlabs/skeleton-svelte';
	import '@sjsf/form/fields/extra-widgets/rating';

	declare module '@sjsf/form' {
		interface UiOptions {
			skeleton3Rating?: SvelteComponentProps<typeof Rating>;
		}
	}
</script>

<script lang="ts">
	import { type ComponentProps, defineDisabled, getFormContext } from '@sjsf/form';
	let { value = $bindable(), config, handlers }: ComponentProps['ratingWidget'] = $props();

	const ctx = getFormContext();

	const attributes: SvelteComponentProps<typeof Rating> = $derived(
		defineDisabled(ctx, {
			ids: {
				hiddenInput: config.id
			},
			name: config.name,
			required: config.required,
			readOnly: config.schema.readOnly,
			onHoverChange: handlers.oninput,
			onValueChange: (details) => {
				value = details.value;
				handlers.onchange?.();
			},
			count: config.schema.maximum,
			...config.uiOptions?.skeleton3Rating
		})
	);
</script>

<Rating {value} {...attributes} />
