<script lang="ts">
	import { FormContent, useForm } from '@sjsf/form';
	import { createValidator } from '@sjsf/ajv8-validator';
	import { theme } from '@sjsf/form/basic-theme';
	import { translation } from '@sjsf/form/translations/en';
	import { useMutation } from '@sjsf/form/use-mutation.svelte';
	import { page } from '$app/stores';

	import type { PageData, ActionData } from './$types';
	import { schema } from './schema';

	const { data }: { data: PageData; form: ActionData } = $props();

	const mutation = useMutation({
		async mutate(signal, data: string, e: SubmitEvent) {}
	});

	$effect(() => page.subscribe((page) => console.log('Page update', page)));

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
		<button type="submit">Submit</button>
	</form>
	<pre>{JSON.stringify(data, null, 2)}</pre>
</article>
