import { AdditionalPropertyKeyValidationErrorType } from '$lib/client/index.js';

export const ERROR_TYPE_OBJECTS: Record<AdditionalPropertyKeyValidationErrorType, string> = {
  [AdditionalPropertyKeyValidationErrorType.ForbiddenSequence]: 'sequences',
  [AdditionalPropertyKeyValidationErrorType.ForbiddenSuffix]: 'suffixes'
};
