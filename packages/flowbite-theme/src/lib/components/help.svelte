<script lang="ts" module>
	import type { HelperProps } from 'flowbite-svelte/Helper.svelte';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteHelp?: HelperProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, retrieveUiProps, type ComponentProps } from '@sjsf/form';
	import Helper from 'flowbite-svelte/Helper.svelte';

	const { config, help }: ComponentProps['help'] = $props();

	const ctx = getFormContext();
</script>

<Helper {...retrieveUiProps(ctx, config, 'flowbiteHelp', {})}>
	{help}
</Helper>
