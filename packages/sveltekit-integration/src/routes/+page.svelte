<script lang="ts">
	import { FormContent } from '@sjsf/form';
	import { createValidator } from '@sjsf/ajv8-validator';
	import { theme } from '@sjsf/form/basic-theme';
	import { translation } from '@sjsf/form/translations/en';

	import { useSvelteKitForm } from '$lib/client';

	import type { PageData, ActionData } from './$types';

	const { form } = useSvelteKitForm<ActionData, PageData, 'form2'>({
		...theme,
		name: 'form2',
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
</article>
