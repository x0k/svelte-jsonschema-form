<script lang="ts">
	import { BasicForm, createForm, type FormOptions } from '@sjsf/form';
	import 'beercss/dist/cdn/beer.css';

	const props: FormOptions<any> = $props();

	const form = createForm(props);
</script>

<BasicForm {form} />
