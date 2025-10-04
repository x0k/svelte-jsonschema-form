import { decodePseudoElement, type FormIdBuilder, type Schema } from '@sjsf/form';

export interface FormIdBuilderOptions {
  schema: Schema;
  idPrefix: string;
  pseudoSeparator?: string
}

export const DEFAULT_PSEUDO_SEPARATOR = "$$"

export function createFormIdBuilder({
  idPrefix,
  schema,
  pseudoSeparator = DEFAULT_PSEUDO_SEPARATOR
}: FormIdBuilderOptions): FormIdBuilder {
  return {
    fromPath: (path) => {
      let str = '';
      const currentSchema = schema
      for (let i = 0; i < path.length; i++) {
        const p = path[i]!;
        const pseudo = decodePseudoElement(p);
        str +=
          pseudo !== undefined
            ? `${pseudoSeparator}${pseudo}`
            : typeof p === 'string' ? '.' + p : `[${p}]`;
      }
      return `${idPrefix}${str}`;
    }
  };
}
