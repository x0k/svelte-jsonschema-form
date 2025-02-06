import { createTemplates } from './model.js';
import FieldTemplate from "./field-template.svelte";
import ObjectTemplate from "./object-template.svelte";
import ObjectPropertyTemplate from "./object-property-template.svelte";
import ArrayTemplate from "./array-template.svelte";
import ArrayItemTemplate from "./array-item-template.svelte";
import MultiTemplate from './multi-template.svelte';

export const templates = createTemplates({
  field: FieldTemplate,
  object: ObjectTemplate,
  "object-property": ObjectPropertyTemplate,
  array: ArrayTemplate,
  "array-item": ArrayItemTemplate,
  multi: MultiTemplate,
})
