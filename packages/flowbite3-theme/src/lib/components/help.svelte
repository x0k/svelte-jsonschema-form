<script lang="ts" module>
	import type { HelperProps } from 'flowbite-svelte';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Help?: HelperProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, helpAttributes, type ComponentProps } from '@sjsf/form';
	import Helper from 'flowbite-svelte/Helper.svelte';

	const { config, help }: ComponentProps['help'] = $props();

	const ctx = getFormContext();
</script>

<Helper {...helpAttributes(ctx, config, 'flowbite3Help', {})}>{help}</Helper>
