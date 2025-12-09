<script lang="ts" module>
	import type { HTMLOutputAttributes } from 'svelte/elements';

	declare module '@sjsf/form' {
		interface UiOptions {
			beercssHelp?: HTMLOutputAttributes;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, helpAttributes, type ComponentProps } from '@sjsf/form';

	const { help, config }: ComponentProps['help'] = $props();

	const ctx = getFormContext();
</script>

<output {...helpAttributes(ctx, config, 'beercssHelp', {})}>
	{help}
</output>
