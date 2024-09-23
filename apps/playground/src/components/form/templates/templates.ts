import { type Template, type Templates, type TemplateType } from './model'

import Object from './object.svelte'

export const templatesRegistry: { [T in TemplateType]: Template<T> } = {
  object: Object
}

export const templates: Templates = (type) => templatesRegistry[type]
