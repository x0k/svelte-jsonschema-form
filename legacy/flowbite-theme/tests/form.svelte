<script lang="ts">
	import { BasicForm, createForm, type FormOptions, type Validator } from '@sjsf/form';

	import '../src/app.css';

	const props: FormOptions<any> = $props();

	const form = createForm(props);
</script>

<BasicForm {form} />
