<script lang="ts">
	import { BasicForm, createForm, type FormOptions } from '@sjsf/form';

	import '../src/lib/extra-widgets/checkboxes-include.js';
	import '../src/app.css';

	const props: FormOptions<any> = $props();

	const form = createForm(props);
</script>

<BasicForm {form} />
