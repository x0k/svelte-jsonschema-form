<script lang="ts">
	import { BasicForm, createForm, type FormOptions, type Validator } from '@sjsf/form';

	import '../src/app.css';
	import { BitsConfig } from 'bits-ui';

	const props: FormOptions<any, Validator> = $props();

	const form = createForm(props);

	let portalEl = $state.raw() as HTMLDivElement;
</script>

<BitsConfig defaultPortalTo={portalEl}>
	<BasicForm {form} />
</BitsConfig>
<div bind:this={portalEl}></div>
