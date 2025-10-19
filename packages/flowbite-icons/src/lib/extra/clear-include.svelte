<script lang="ts" module>
	import CloseOutline from 'flowbite-svelte-icons/CloseOutline.svelte';
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
	<CloseOutline />
{/snippet}
