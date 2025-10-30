<script lang="ts">
	import { BasicForm, createForm, type FormOptions } from '@sjsf/form';

	import '../src/app.css';

	const props: FormOptions<any, any> = $props();

	const form = createForm(props);
</script>

<BasicForm {form} />
