import type { Schema } from '@sjsf/form';

import { AdditionalPropertyKeyValidationErrorType } from '$lib/client/index.js';

export const ERROR_TYPE_OBJECTS: Record<AdditionalPropertyKeyValidationErrorType, string> = {
  [AdditionalPropertyKeyValidationErrorType.ForbiddenSequence]: 'sequences',
  [AdditionalPropertyKeyValidationErrorType.ForbiddenSuffix]: 'suffixes'
};

export const schema: Schema = {
  title: 'A customizable registration form',
  description: 'A simple form with additional properties example.',
  type: 'object',
  required: ['firstName', 'lastName'],
  additionalProperties: {
    type: 'string'
  },
  properties: {
    firstName: {
      type: 'string',
      title: 'First name'
    },
    lastName: {
      type: 'string',
      title: 'Last name'
    }
  }
};
