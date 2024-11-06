import type { ActionResult } from '@sveltejs/kit';
import { MutationOptions, useMutation } from '@sjsf/form/use-mutation.svelte';
import { DEV } from 'esm-env';
import type { FormState } from '@sjsf/form';

import { applyAction, deserialize } from '$app/forms';
import { invalidateAll } from '$app/navigation';

const JSON_CHUNKS_KEY = '__sjsf_sveltekit_json_chunks';

function capitalize<T extends string>(str: T): Capitalize<T> {
	return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}

function getSubmitter(e: SubmitEvent) {
	if (e.submitter instanceof HTMLButtonElement || e.submitter instanceof HTMLInputElement) {
		return e.submitter;
	}
	return null;
}

function makeFormAttributeAccessor(
	form: HTMLFormElement,
	submitter: HTMLButtonElement | HTMLInputElement | null
) {
	return (attribute: 'method' | 'action' | 'enctype') =>
		submitter?.hasAttribute(`form${attribute}`)
			? submitter[`form${capitalize(attribute)}`]
			: form[attribute];
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
	form: () => FormState<T, unknown>;
	mutate: (signal: AbortSignal, data: T, e: SubmitEvent) => Promise<R>;
	/** @default 500000 */
	jsonChunkSize?: number;
	/** @default true */
	reset?: boolean;
	/** @default true */
	invalidateAll?: boolean;
}

function clone<T extends HTMLElement>(element: T): T {
	return HTMLElement.prototype.cloneNode.call(element) as T;
}

export function useSvelteKit<T, E>(input: SvelteKitOptions<T, ActionResult, E>) {
	const jsonChunkSize = $derived(input.jsonChunkSize ?? 500000);
	const shouldReset = $derived(input.reset ?? true);
	const shouldInvalidateAll = $derived(input.invalidateAll ?? true);
	const options = input as MutationOptions<[T, SubmitEvent], ActionResult, E>;

	// Based on https://github.com/sveltejs/kit/blob/92b2686314a7dbebee1761c3da7719d599f003c7/packages/kit/src/runtime/app/forms.js
	options.mutate = async (signal, data: T, e: SubmitEvent) => {
		const form = e.currentTarget;
		if (!(form instanceof HTMLFormElement)) {
			throw new Error(`Event currentTarget is not an HTMLFormElement`);
		}
		const clonedForm = clone(form);

		if (DEV && clonedForm.method !== 'POST') {
			throw new Error('use:enhance can only be used on <form> fields with method="POST"');
		}

		const getAttribute = makeFormAttributeAccessor(clonedForm, getSubmitter(e));
		// const method = getAttribute('method');
		const action = new URL(getAttribute('action'));
		const enctype = getAttribute('enctype');

		if (DEV) {
			const formData = new FormData(form);
			for (const value of formData.values()) {
				if (value instanceof File) {
					throw new Error(
						'Your form contains <input type="file"> fields, but is missing the necessary `enctype="multipart/form-data"` attribute. This will lead to inconsistent behavior between enhanced and native forms. For more details, see https://github.com/sveltejs/kit/issues/9819.'
					);
				}
			}
		}

		const formData = new FormData();
		for (const chunk of chunks(JSON.stringify(data), jsonChunkSize)) {
			formData.append(JSON_CHUNKS_KEY, chunk);
		}

		let result: ActionResult;
		try {
			const headers = new Headers({
				accept: 'application/json',
				'x-sveltekit-action': 'true'
			});

			// do not explicitly set the `Content-Type` header when sending `FormData`
			// or else it will interfere with the browser's header setting
			// see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects#sect4
			if (enctype !== 'multipart/form-data') {
				headers.set(
					'Content-Type',
					/^(:?application\/x-www-form-urlencoded|text\/plain)$/.test(enctype)
						? enctype
						: 'application/x-www-form-urlencoded'
				);
			}

			// @ts-expect-error `URLSearchParams(form_data)` is kosher, but typescript doesn't know that
			const body = enctype === 'multipart/form-data' ? formData : new URLSearchParams(formData);

			const response = await fetch(action, {
				method: 'POST',
				headers,
				cache: 'no-cache',
				body,
				signal
			});

			result = deserialize(await response.text());
			if (result.type === 'error') result.status = response.status;
		} catch (error) {
			result = { type: 'error', error };
		}

		if (result.type === 'success') {
			const form = input.form();
			if (shouldReset) {
				form.reset();
			}
			if (shouldInvalidateAll) {
				await invalidateAll();
			}
		}
		// For success/failure results, only apply action if it belongs to the
		// current page, otherwise `form` will be updated erroneously
		if (
			location.origin + location.pathname === action.origin + action.pathname ||
			result.type === 'redirect' ||
			result.type === 'error'
		) {
			await applyAction(result);
		}
		return result;
	};

	return useMutation(options);
}
