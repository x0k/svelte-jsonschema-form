/* eslint-disable @typescript-eslint/no-explicit-any */
import { onDestroy } from 'svelte';
import type { AnyKey } from '@sjsf/form/lib/types';
import { isRecord } from '@sjsf/form/lib/object';
import {
	groupErrors,
	useForm,
	type FormState,
	type Schema,
	type SchemaValue,
	type UseFormOptions
} from '@sjsf/form';

import { page } from '$app/stores';

import { type InitialFormData, type ValidatedFormData } from '../model';

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

export type SvelteKitFormState<V, E> = E extends never ? never : FormState<V, E>;

export type SendFormFromInitialFormData<IFD, V, E> =
	IFD extends InitialFormData<V, E, infer SendSchema> ? SendSchema : false;

export type SendDataFromValidatedFormData<VFD, E> =
	VFD extends ValidatedFormData<E, infer SendData> ? SendData : false;

export type UseSvelteKitOptions<FormName, V, E, SendSchema extends boolean> = Omit<
	UseFormOptions<V, E>,
	SendSchema extends true ? 'schema' : never
> & {
	name: FormName;
	/** @default true */
	applyAction?: boolean;
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
	ActionData,
	PageData,
	FormName extends FormNameFromActionDataUnion<ActionData>,
	FallbackValue = SchemaValue,
	// Local
	VFD = ValidatedFormDataFromActionDataUnion<ActionData, FormName>,
	E = ValidatorErrorFromValidatedFormData<VFD>,
	IFD = InitialFromDataFromPageData<PageData, FormName>,
	V = FormValueFromInitialFormData<IFD, E, FallbackValue>,
	SendSchema extends boolean = SendFormFromInitialFormData<IFD, V, E>,
	SendData extends boolean = SendDataFromValidatedFormData<VFD, E>
>(options: UseSvelteKitOptions<FormName, V, E, SendSchema>): SvelteKitFormState<V, E> {
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
	const form = useForm<V, E>(Object.setPrototypeOf(options, lastInitialFormData ?? null));
	return form as unknown as SvelteKitFormState<V, E>;
}
