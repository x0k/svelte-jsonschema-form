import { type Options, Ajv } from 'ajv';

import { addFormComponents, DEFAULT_AJV_CONFIG } from './model.js';
import { AjvValidator } from './validator.js';

export function createValidator(options: Options = DEFAULT_AJV_CONFIG) {
  return new AjvValidator(addFormComponents(new Ajv(options)));
}
