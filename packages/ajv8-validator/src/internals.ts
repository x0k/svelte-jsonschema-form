import type { FormValue } from '@sjsf/form';

export const CAST_FORM_DATA = <T>(data: FormValue) => ({ value: data as T });
export const NO_FILED_ERRORS = (): string[] => [];