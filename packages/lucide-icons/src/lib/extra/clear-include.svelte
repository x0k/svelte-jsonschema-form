<script lang="ts" module>
	import X from '@lucide/svelte/icons/x';
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

