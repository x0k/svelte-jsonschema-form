<script lang="ts">
	import { FormContent, useForm } from '@sjsf/form';
	import { createValidator } from '@sjsf/ajv8-validator';
	import { theme } from '@sjsf/form/basic-theme';
	import { translation } from '@sjsf/form/translations/en';

	import { page } from '$app/stores';
	import { useSvelteKitForm } from '$lib/client.svelte';

	import type { PageData, ActionData } from './$types';
	import { schema } from './schema';

	const { data, form: f }: { data: PageData; form: ActionData } = $props();

	const form2 = useSvelteKitForm<ActionData, "form", PageData>("form")

	const unsub = page.subscribe((page) => console.log('Page update', page))
	console.log("after sub")
	$effect(() => unsub);

	const form = useForm({
		...data.form,
		...theme,
		schema,
		validator: createValidator(),
		translation
	});
</script>

<article>
	<header>
		<h1>New Contact</h1>
	</header>
	<form method="POST" style="display: flex; flex-direction: column; gap: 1rem">
		<FormContent bind:value={form.formValue} />
		<button type="submit" style="padding: 0.5rem;">Submit</button>
	</form>
	<pre>{JSON.stringify(data, null, 2)}</pre>
</article>
