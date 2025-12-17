<script lang="ts">
	import { BasicForm, createForm, type FormOptions } from '@sjsf/form';
	import { BitsConfig } from 'bits-ui';

	import '../src/lib/theme/extra-widgets/checkboxes-include.js';
	import '../src/app.css';

	const props: FormOptions<any> = $props();

	const form = createForm(props);

	let portalEl = $state.raw() as HTMLDivElement;
</script>

<BitsConfig defaultPortalTo={portalEl}>
	<BasicForm {form} />
</BitsConfig>
<div bind:this={portalEl}></div>
