import type { ActionResult } from '@sveltejs/kit';
import { useMutation } from '@sjsf/form/use-mutation.svelte';

import { applyAction, deserialize } from '$app/forms';
import { invalidateAll } from '$app/navigation';

function getSubmitterAction(submitter: EventTarget | null) {
	if (submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement) {
		return submitter.formAction;
	}
	return null;
}

export function useSvelteKit<T, E>() {
	const mutation = useMutation<[T, SubmitEvent], ActionResult, E>({
		mutate: async (signal, data: T, e: SubmitEvent) => {
			const form = e.currentTarget;
			if (!(form instanceof HTMLFormElement)) {
				throw new Error(`Event currentTarget is not an HTMLFormElement`);
			}
			const formData = new FormData(form);
			const response = await fetch(getSubmitterAction(e.submitter) || form.action, {
        signal,
				method: form.method,
				body: formData,
				headers: {
					'x-sveltekit-action': 'true'
				}
			});
			const result = deserialize(await response.text());
			if (result.type === 'success') {
				await invalidateAll();
			}
			applyAction(result);
			return result;
		}
	});
}
