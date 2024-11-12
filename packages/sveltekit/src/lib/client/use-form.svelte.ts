/* eslint-disable @typescript-eslint/no-explicit-any */
import { onDestroy } from 'svelte';
import type { AnyKey } from '@sjsf/form/lib/types';
import { isRecord } from '@sjsf/form/lib/object';
import {
	DEFAULT_ID_SEPARATOR,
	DEFAULT_PSEUDO_ID_SEPARATOR,
	groupErrors,
	useForm2,
	type AdditionalPropertyKeyError,
	type AdditionalPropertyKeyValidator,
	type Schema,
	type SchemaValue,
	type UseFormOptions2
} from '@sjsf/form';

import { page } from '$app/stores';

import type { InitialFormData, ValidatedFormData } from '../model';

import { useSvelteKitMutation, type SveltekitMutationOptions } from './use-mutation.svelte';

export type ValidatedFormDataFromActionDataBranch<ActionData, FormName extends AnyKey> =
	ActionData[keyof ActionData & FormName] extends ValidatedFormData<any, any>
		? ActionData[keyof ActionData & FormName]
		: never;

export type ValidatedFormDataFromActionDataUnion<
	ActionData,
	FormName extends AnyKey
> = ActionData extends any ? ValidatedFormDataFromActionDataBranch<ActionData, FormName> : never;

export type FormNameFromActionDataBranch<ActionData> = keyof {
	[K in keyof ActionData]: ActionData[K] extends ValidatedFormData<any, any> ? K : never;
};

export type FormNameFromActionDataUnion<ActionData> = ActionData extends any
	? FormNameFromActionDataBranch<ActionData>
	: never;

export type ValidatorErrorFromValidatedFormData<VFD> =
	VFD extends ValidatedFormData<infer E, any> ? E : never;

export type InitialFromDataFromPageData<PageData, FormName extends AnyKey> =
	PageData[keyof PageData & FormName] extends InitialFormData<any, any, any>
		? PageData[keyof PageData & FormName]
		: never;

export type FormValueFromInitialFormData<IFD, E, FallbackValue> =
	IFD extends InitialFormData<infer T, E, any>
		? unknown extends T
			? FallbackValue
			: T
		: FallbackValue;

export type SendDataFromValidatedFormData<VFD, E> =
	VFD extends ValidatedFormData<E, infer SendData> ? SendData : false;

export type SendSchemaFromInitialFormData<IFD, V, E> =
	IFD extends InitialFormData<V, E, infer SendSchema> ? SendSchema : false;

type SvelteKitForm<
	ActionData,
	PageData,
	N extends FormNameFromActionDataUnion<ActionData>,
	FallbackValue = SchemaValue
> = {
	name: N;
	__actionData: ActionData;
	__pageData: PageData;
	__fallbackValue: FallbackValue;
};

type NameFromSvelteKitForm<F extends SvelteKitForm<any, any, any>> =
	F extends SvelteKitForm<any, any, infer Name> ? Name : never;

export function svelteKitForm<
	ActionData extends Record<AnyKey, any> | null,
	PageData,
	N extends FormNameFromActionDataUnion<ActionData> = FormNameFromActionDataUnion<ActionData>,
	FallbackValue = SchemaValue
>(
	name: FormNameFromActionDataUnion<ActionData>
): SvelteKitForm<ActionData, PageData, N, FallbackValue> {
	return { name } as SvelteKitForm<ActionData, PageData, N, FallbackValue>;
}

export type AdditionalPropertyKeyValidationError =
	| string
	| ((ctx: { key: string; separator: string; separators: string[] }) => string);

export type UseSvelteKitFormOptions<
	F extends SvelteKitForm<any, any, any>,
	V,
	E,
	SendSchema extends boolean,
	AD = F['__actionData']
> = Omit<UseFormOptions2<V, E>, 'onSubmit' | (SendSchema extends true ? 'schema' : never)> &
	SveltekitMutationOptions<AD, V> & {
		// Form options
		spec: F;
		/** @default false */
		forceDataInvalidation?: boolean;
		/** @default true */
		resetOnUpdate?: boolean;
		additionalPropertyKeyValidationError?: AdditionalPropertyKeyValidationError;
	} & (SendSchema extends true
		? {
				schema?: Schema;
			}
		: { schema: Schema });

export function useSvelteKitForm<
	const O extends UseSvelteKitFormOptions<any, any, any, any, any>,
	// Local
	SKF extends SvelteKitForm<any, any, any> = O['spec'],
	ActionData = SKF['__actionData'],
	PageData = SKF['__pageData'],
	FallbackValue = SKF['__fallbackValue'],
	N extends AnyKey = NameFromSvelteKitForm<SKF>,
	VFD = ValidatedFormDataFromActionDataUnion<ActionData, N>,
	IFD = InitialFromDataFromPageData<PageData, N>,
	E = O extends
		| { additionalPropertyKeyValidationError: AdditionalPropertyKeyValidationError }
		| { additionalPropertyKeyValidator: AdditionalPropertyKeyValidator }
		? ValidatorErrorFromValidatedFormData<VFD> | AdditionalPropertyKeyError
		: ValidatorErrorFromValidatedFormData<VFD>,
	V = FormValueFromInitialFormData<IFD, E, FallbackValue>,
	SendSchema extends boolean = SendSchemaFromInitialFormData<IFD, V, E>,
	SendData extends boolean = SendDataFromValidatedFormData<VFD, E>
>(options: O) {
	let lastInitialFormData: InitialFormData<V, E, SendSchema> | undefined;
	let initialized = false;
	const spec: SKF = options.spec;
	const unsubscribe = page.subscribe((page) => {
		if (isRecord(page.form)) {
			const validationData = page.form[spec.name] as ValidatedFormData<E, SendData> | undefined;
			if (validationData !== undefined) {
				if (initialized) {
					if (validationData.sendData) {
						form.formValue = validationData.data;
					}
					form.errors = groupErrors(validationData.errors);
				} else {
					initialized = true;
					lastInitialFormData = {
						schema: options.schema ?? page.data[spec.name as string].schema,
						initialValue: validationData.data as V,
						initialErrors: validationData.errors
					};
				}
				return;
			}
		}
		if (!initialized) {
			initialized = true;
			lastInitialFormData = page.data[spec.name as string];
			return;
		}
	});
	onDestroy(unsubscribe);

	const mutation = useSvelteKitMutation<ActionData, V>(options);

	const separators = [
		options.idSeparator ?? DEFAULT_ID_SEPARATOR,
		options.pseudoIdSeparator ?? DEFAULT_PSEUDO_ID_SEPARATOR
	];
	const additionalPropertyKeyValidationError = $derived(
		options.additionalPropertyKeyValidationError
	);
	const form = useForm2<UseFormOptions2<V, E>>(
		Object.setPrototypeOf(options, {
			...lastInitialFormData,
			onSubmit: mutation.run,
			additionalPropertyKeyValidator: additionalPropertyKeyValidationError && {
				validateAdditionalPropertyKey(key: string): string[] {
					for (const separator of separators) {
						if (key.includes(separator)) {
							return [
								typeof additionalPropertyKeyValidationError === 'string'
									? additionalPropertyKeyValidationError
									: additionalPropertyKeyValidationError({ key, separator, separators })
							];
						}
					}
					return [];
				}
			}
		})
	);

	return {
		form,
		mutation,
		enhance: form.enhance.bind(form)
	};
}
