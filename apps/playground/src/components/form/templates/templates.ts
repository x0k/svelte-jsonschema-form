import { type Template, type Templates, type TemplateType } from './model'

import Object from './object.svelte'
import Array from './array.svelte'

export const templatesRegistry: { [T in TemplateType]: Template<T> } = {
  object: Object,
  array: Array,
}

export const templates: Templates = (type) => templatesRegistry[type]
