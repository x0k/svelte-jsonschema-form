<script lang="ts" module>
	import X from 'svelte-radix/Cross1.svelte';
	import '@sjsf/form/extra-labels/clear';

	declare module '../definitions.js' {
		interface ExtraIcons {
			clear: {};
		}
	}

	import { definitions } from '../definitions.js';

	definitions.clear = clear;
</script>

{#snippet clear()}
	<X size={20} />
{/snippet}
