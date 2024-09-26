import { type Template, type Templates, type TemplateType } from "./model";

import Object from "./object.svelte";
import ObjectProperty from './object-property.svelte';
import Array from "./array.svelte";
import ArrayItem from "./array-item.svelte";

export const templatesRegistry: { [T in TemplateType]: Template<T> } = {
  object: Object,
  'object-property': ObjectProperty,
  array: Array,
  "array-item": ArrayItem,
};

export const templates: Templates = (type) => templatesRegistry[type];
