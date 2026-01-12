import type { Creatable, Validator as SJSFValidator, ValidatorFactoryOptions } from '@sjsf/form';

import { createFormValidator as ajv } from '@sjsf/ajv8-validator';
import { createFormValidator as schemasafe } from '@sjsf/schemasafe-validator';
import { createFormValidator as cfworker } from '@sjsf/cfworker-validator';

export enum Validator {
	Ajv = 'ajv8',
	SchemaSafe = 'schemasafe',
	CfWorker = 'cfworker',
	Zod = 'zod4',
	Valibot = 'valibot'
}

export const VALIDATORS = Object.values(Validator);

export const SJSF_VALIDATORS: Record<
	Validator,
	Creatable<SJSFValidator, ValidatorFactoryOptions>
> = {
	[Validator.Ajv]: ajv,
	[Validator.SchemaSafe]: schemasafe,
	[Validator.CfWorker]: cfworker,
	[Validator.Zod]: ajv,
	[Validator.Valibot]: ajv
};

export const VALIDATOR_TITLES: Record<Validator, string> = {
	[Validator.Ajv]: 'Ajv',
	[Validator.SchemaSafe]: '@exodus/schemasafe',
	[Validator.CfWorker]: '@cfworker/json-schema',
	[Validator.Zod]: 'Zod v4 (output only)',
	[Validator.Valibot]: 'Valibot (output only)'
};

export const VALIDATOR_PEER_DEPS: Record<Validator, string> = {
	[Validator.Ajv]: 'ajv',
	[Validator.SchemaSafe]: '@exodus/schemasafe',
	[Validator.CfWorker]: '@cfworker/json-schema',
	[Validator.Zod]: 'zod',
	[Validator.Valibot]: 'valibot @valibot/to-json-schema'
};
