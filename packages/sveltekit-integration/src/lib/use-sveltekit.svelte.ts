import type { ActionResult } from '@sveltejs/kit';
import { MutationOptions, useMutation } from '@sjsf/form/use-mutation.svelte';

import { applyAction, deserialize } from '$app/forms';
import { invalidateAll } from '$app/navigation';

const JSON_CHUNKS_KEY = '__sjsf_sveltekit_json_chunks';

function getSubmitterAction(submitter: EventTarget | null) {
	if (submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement) {
		return submitter.formAction;
	}
	return null;
}

// https://stackoverflow.com/a/29202760/70894
function* chunks(str: string, size: number) {
	const numChunks = Math.ceil(str.length / size);
	for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
		yield str.substring(o, o + size);
	}
}

export interface SvelteKitOptions<T, R, E>
	extends Omit<MutationOptions<[T, SubmitEvent], R, E>, 'mutate'> {
	/** @default 500000 */
	jsonChunkSize?: number;
}

export function useSvelteKit<T, E>(input: SvelteKitOptions<T, ActionResult, E>) {
	const jsonChunkSize = $derived(input.jsonChunkSize ?? 500000);
	const options = input as MutationOptions<[T, SubmitEvent], ActionResult, E>;
	options.mutate = async (signal, data: T, e: SubmitEvent) => {
		const form = e.currentTarget;
		if (!(form instanceof HTMLFormElement)) {
			throw new Error(`Event currentTarget is not an HTMLFormElement`);
		}
		const formData = new FormData();
		for (const chunk of chunks(JSON.stringify(data), jsonChunkSize)) {
			formData.append(JSON_CHUNKS_KEY, chunk);
		}

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
	};
	return useMutation(options);
}
