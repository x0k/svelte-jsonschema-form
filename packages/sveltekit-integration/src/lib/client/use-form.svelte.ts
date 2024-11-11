/* eslint-disable @typescript-eslint/no-explicit-any */
import { onDestroy } from 'svelte';
import type { AnyKey } from '@sjsf/form/lib/types';
import { isRecord } from '@sjsf/form/lib/object';
import {
	groupErrors,
	useForm,
	type Schema,
	type SchemaValue,
	type UseFormOptions
} from '@sjsf/form';

import { page } from '$app/stores';

import type { InitialFormData, ValidatedFormData } from '../model';

import { useSvelteKitMutation, type SveltekitMutationOptions } from './use-mutation.svelte';

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

export type InitialFromDataFromPageData<PageData, FormName extends AnyKey> =
	PageData[keyof PageData & FormName] extends InitialFormData<any, any, any>
		? PageData[keyof PageData & FormName]
		: never;

export type FormValueFromInitialFormData<IFD, E, FallbackValue> =
	IFD extends InitialFormData<infer T, E, any> ? T : FallbackValue;

export type SendDataFromValidatedFormData<VFD, E> =
	VFD extends ValidatedFormData<E, infer SendData> ? SendData : false;

export type SendSchemaFromInitialFormData<IFD, V, E> =
	IFD extends InitialFormData<V, E, infer SendSchema> ? SendSchema : false;

export type UseSvelteKitFormOptions<ActionData, FormName, V, E, SendSchema extends boolean> = Omit<
	UseFormOptions<V, E>,
	'onSubmit' | (SendSchema extends true ? 'schema' : never)
> &
	SveltekitMutationOptions<ActionData, V> & {
		// Form options
		name: FormName;
		/** @default false */
		forceDataInvalidation?: boolean;
		/** @default true */
		resetOnUpdate?: boolean;
	} & (SendSchema extends true
		? {
				schema?: Schema;
			}
		: { schema: Schema });

export function useSvelteKitForm<
	ActionData extends Record<AnyKey, any> | null,
	PageData,
	FormName extends
		FormNameFromActionDataUnion<ActionData> = FormNameFromActionDataUnion<ActionData>,
	FallbackValue = SchemaValue,
	// Local
	VFD = ValidatedFormDataFromActionDataUnion<ActionData, FormName>,
	IFD = InitialFromDataFromPageData<PageData, FormName>,
	E = ValidatorErrorFromValidatedFormData<VFD>,
	V = FormValueFromInitialFormData<IFD, E, FallbackValue>,
	SendSchema extends boolean = SendSchemaFromInitialFormData<IFD, V, E>,
	SendData extends boolean = SendDataFromValidatedFormData<VFD, E>
>(options: UseSvelteKitFormOptions<ActionData, FormName, V, E, SendSchema>) {
	let lastInitialFormData: InitialFormData<V, E, SendSchema> | undefined;
	let initialized = false;
	const unsubscribe = page.subscribe((page) => {
		if (isRecord(page.form)) {
			const validationData = page.form[options.name] as
				| ValidatedFormData<E, SendData>
				| undefined;
			if (validationData !== undefined) {
				if (initialized) {
					if (validationData.sendData) {
						form.formValue = validationData.data;
					}
					form.errors = groupErrors(validationData.errors);
				} else {
					initialized = true;
					lastInitialFormData = {
						schema: options.schema ?? page.data[options.name as string].schema,
						initialValue: validationData.data as V,
						initialErrors: validationData.errors
					};
				}
				return;
			}
		}
		if (!initialized) {
			initialized = true;
			lastInitialFormData = page.data[options.name as string];
			return;
		}
	});
	onDestroy(unsubscribe);

	const mutation = useSvelteKitMutation<ActionData, V>(options);

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
