export { resolver } from '@sjsf/form/resolvers/basic';
import '@sjsf/form/fields/extra-fields/unknown-native-file-include';
import '@sjsf/form/fields/extra-fields/enum-include';
import '@sjsf/form/fields/extra-fields/multi-enum-include';

export { translation } from '@sjsf/form/translations/en';
export { createFormMerger as merger } from '@sjsf/form/mergers/modern';
export { createFormIdBuilder as idBuilder } from '@sjsf/form/id-builders/modern';
export { createFormValidator as validator } from '@sjsf/ajv8-validator';
export { theme } from '@sjsf/basic-theme';
import '@sjsf/basic-theme/extra-widgets/checkboxes-include';
