export { resolver } from '@sjsf/form/resolvers/basic';
import '@sjsf/form/fields/extra/unknown-native-file-include';
import '@sjsf/form/fields/extra/enum-include';
import '@sjsf/form/fields/extra/multi-enum-include';
import '@sjsf/form/fields/extra/boolean-select-include';
import '@sjsf/form/fields/extra/file-include';

export { translation } from '@sjsf/form/translations/en';
export { createFormMerger as merger } from '@sjsf/form/mergers/modern';
export { createFormIdBuilder as idBuilder } from '@sjsf/form/id-builders/modern';
export { createFormValidator as validator } from '@sjsf/ajv8-validator';
export { theme } from '@sjsf/basic-theme';
import '@sjsf/basic-theme/extra-widgets/checkboxes-include';
import '@sjsf/basic-theme/extra-widgets/radio-include';
import '@sjsf/basic-theme/extra-widgets/file-include';

