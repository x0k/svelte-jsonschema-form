/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEV } from 'esm-env';
import { onDestroy } from 'svelte';
import type { ActionResult } from '@sveltejs/kit';
import type { AnyKey } from '@sjsf/form/lib/types';
import { isRecord } from '@sjsf/form/lib/object';
import {
	groupErrors,
	useForm,
	type Schema,
	type SchemaValue,
	type UseFormOptions
} from '@sjsf/form';
import { useMutation, type MutationOptions } from '@sjsf/form/use-mutation.svelte';

import { page } from '$app/stores';
import { applyAction, deserialize } from '$app/forms';
import { invalidateAll } from '$app/navigation';

import { JSON_CHUNKS_KEY, type InitialFormData, type ValidatedFormData } from './model';

export type ValidatedFormDataFromActionDataBranch<ActionData, FormName extends keyof ActionData> =
	ActionData[FormName] extends ValidatedFormData<any, any> ? ActionData[FormName] : never;

export type ValidatedFormDataFromActionDataUnion<
	ActionData,
	FormName extends keyof ActionData
> = ActionData extends any ? ValidatedFormDataFromActionDataBranch<ActionData, FormName> : never;

export type FormNameFromActionDataBranch<ActionData> = keyof {
	[K in keyof ActionData]: ActionData[K] extends ValidatedFormData<any, any> ? K : never;
};

export type FormNameFromActionDataUnion<ActionData> = ActionData extends any
	? FormNameFromActionDataBranch<ActionData>
	: never;

export type ValidatorErrorFromValidatedFormData<VFD> =
	VFD extends ValidatedFormData<infer E, any> ? E : never;

export type InitialFromDataFromPageData<PageData, FormName extends AnyKey> = {
	[K in keyof PageData & FormName]: PageData[K] extends InitialFormData<any, any, any>
		? PageData[K]
		: never;
}[keyof PageData & FormName];

export type FormValueFromInitialFormData<IFD, E, FallbackValue> =
	IFD extends InitialFormData<infer T, E, any> ? T : FallbackValue;

export type SendFormFromInitialFormData<IFD, V, E> =
	IFD extends InitialFormData<V, E, infer SendSchema> ? SendSchema : false;

export type SendDataFromValidatedFormData<VFD, E> =
	VFD extends ValidatedFormData<E, infer SendData> ? SendData : false;

export type UseSvelteKitOptions<FormName, V, E, SendSchema extends boolean> = Omit<
	UseFormOptions<V, E>,
	'onSubmit' | (SendSchema extends true ? 'schema' : never)
> &
	Omit<MutationOptions<[V, SubmitEvent], unknown, unknown>, 'mutate'> & {
		// Form options
		name: FormName;
		/** @default true */
		applyAction?: boolean;
		/** @default false */
		forceDataInvalidation?: boolean;
		/** @default true */
		resetOnUpdate?: boolean;
		// Mutation options
		/** @default 500000 */
		jsonChunkSize?: number;
		/** @default true */
		reset?: boolean;
		/** @default true */
		invalidateAll?: boolean;
	} & (SendSchema extends true
		? {
				schema?: Schema;
			}
		: { schema: Schema });

export function useSvelteKitForm<
	ActionData,
	PageData,
	FormName extends FormNameFromActionDataUnion<ActionData> = FormNameFromActionDataUnion<ActionData>,
	FallbackValue = SchemaValue,
	// Local
	VFD = ValidatedFormDataFromActionDataUnion<ActionData, FormName>,
	E = ValidatorErrorFromValidatedFormData<VFD>,
	IFD = InitialFromDataFromPageData<PageData, FormName>,
	V = FormValueFromInitialFormData<IFD, E, FallbackValue>,
	SendSchema extends boolean = SendFormFromInitialFormData<IFD, V, E>,
	SendData extends boolean = SendDataFromValidatedFormData<VFD, E>
>(options: UseSvelteKitOptions<FormName, V, E, SendSchema>) {
	let lastInitialFormData: InitialFormData<V, E, SendSchema> | undefined;
	let initialized = false;
	const unsubscribe = page.subscribe((page) => {
		if (!initialized) {
			initialized = true;
			lastInitialFormData = page.data[options.name as string];
			return;
		}
		if (options.applyAction !== false && isRecord<ValidatedFormData<E, SendData>>(page.form)) {
			const validationData = page.form[options.name];
			if (validationData.isValid) {
				return;
			}
			if (validationData.sendData) {
				form.formValue = validationData.data;
			}
			form.errors = groupErrors(validationData.errors);
			return;
		}
		// TODO: Clarify conditions for the code below.
		//       What will happen when we have multiple forms on the same page?
		const nextInitialData = page.data[options.name as string] as
			| InitialFormData<V, E, SendSchema>
			| undefined;
		// TODO: Clarify what happens when one of several forms has been updated.
		//       Is referential equality ok here?
		if (!nextInitialData || nextInitialData === lastInitialFormData) {
			return;
		}
		if (options.forceDataInvalidation) {
			form.value = nextInitialData.initialValue;
			form.errors = groupErrors(nextInitialData.initialErrors);
		}
	});
	onDestroy(unsubscribe);

	const jsonChunkSize = $derived(options.jsonChunkSize ?? 500000);

	const mutation = useMutation({
		// Based on https://github.com/sveltejs/kit/blob/92b2686314a7dbebee1761c3da7719d599f003c7/packages/kit/src/runtime/app/forms.js
		async mutate(signal: AbortSignal, data: V, e: SubmitEvent) {
			const form = e.currentTarget;
			if (!(form instanceof HTMLFormElement)) {
				throw new Error(`Event currentTarget is not an HTMLFormElement`);
			}
			const clonedForm = clone(form);
			const getAttribute = makeFormAttributeAccessor(clonedForm, getSubmitter(e));
			const method = getAttribute('method');
			const action = new URL(getAttribute('action'));
			const enctype = getAttribute('enctype');

			if (DEV) {
				if (method !== 'post') {
					throw new Error('use:enhance can only be used on <form> fields with method="POST"');
				}
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

				const body =
					// @ts-expect-error `URLSearchParams(form_data)` is kosher, but typescript doesn't know that
					enctype === 'multipart/form-data' ? formData : new URLSearchParams(formData);

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
				if (options.reset !== false) {
					form.reset();
				}
				if (options.invalidateAll !== false) {
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
		},
		onSuccess: options.onSuccess,
		onFailure: options.onFailure,
		combinator: options.combinator,
		get delayedMs() {
			return options.delayedMs;
		},
		get timeoutMs() {
			return options.timeoutMs;
		}
	});
	const form = useForm<V, E>(
		Object.setPrototypeOf(options, {
			...lastInitialFormData,
			onSubmit: mutation.run
		})
	);
	return {
		form,
		mutation,
		enhance: form.enhance.bind(form)
	};
}

function clone<T extends HTMLElement>(element: T): T {
	return HTMLElement.prototype.cloneNode.call(element) as T;
}

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
