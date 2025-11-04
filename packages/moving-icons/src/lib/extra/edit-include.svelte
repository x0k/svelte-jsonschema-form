<script lang="ts" module>
	import { Pencil } from '@jis3r/icons';
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
	<Pencil size={20} />
{/snippet}
