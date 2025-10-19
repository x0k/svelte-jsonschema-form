<script lang="ts" module>
	import PenOutline from 'flowbite-svelte-icons/PenOutline.svelte';
	import '@sjsf/form/extra-labels/edit';

	declare module '../definitions.js' {
		interface ExtraIcons {
			edit: {};
		}
	}

	import { definitions } from '../definitions.js';

	definitions.edit = edit;
</script>

{#snippet edit()}
	<PenOutline />
{/snippet}
