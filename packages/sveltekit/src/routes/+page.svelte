<script lang="ts">
	import { FormContent } from '@sjsf/form';
	import { createValidator } from '@sjsf/ajv8-validator';
	import { theme } from '@sjsf/form/basic-theme';
	import { translation } from '@sjsf/form/translations/en';

	import { useSvelteKitForm, svelteKitForm } from '$lib/client';

	import type { PageData, ActionData } from './$types';

	const { form, enhance } = useSvelteKitForm({
		...theme,
		spec: svelteKitForm<ActionData, PageData>('form'),
		validator: createValidator(),
		translation,
		onSuccess: console.log,
		onFailure: console.warn,
		additionalPropertyKeyValidationError({ separators }) {
			return `The content of these sequences ("${separators.join('", "')}") is prohibited`;
		}
	});
</script>

<form use:enhance method="POST" novalidate style="display: flex; flex-direction: column; gap: 1rem">
	<FormContent bind:value={form.formValue} />
	<button type="submit" style="padding: 0.5rem;">Submit</button>
</form>
