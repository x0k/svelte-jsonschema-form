<script lang="ts">
	import { BasicForm, createForm, type FormOptions } from '@sjsf/form';

	import '../src/app.css';
	import { BitsConfig } from 'bits-ui';

	const props: FormOptions<any, any> = $props();

	const form = createForm(props);

	let portalEl = $state.raw() as HTMLDivElement;
</script>

<BitsConfig defaultPortalTo={portalEl}>
	<BasicForm {form} />
</BitsConfig>
<div bind:this={portalEl}></div>
