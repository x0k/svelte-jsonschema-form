import { DEFAULT_ID_PREFIX } from '@sjsf/form';
import { escapeRegex } from '@sjsf/form/lib/reg-exp';

export interface IdPrefixParserOptions {
  formData: FormData;
  idSeparator: string;
  idIndexSeparator: string;
  idPseudoSeparator: string;
}

export function parseIdPrefix({
  formData,
  idIndexSeparator,
  idPseudoSeparator,
  idSeparator
}: IdPrefixParserOptions) {
  const first = formData.keys().next().value;
  if (first === undefined) {
    return DEFAULT_ID_PREFIX;
  }
  const escapedIdSeparator = escapeRegex(idSeparator);
  const escapedIndexSeparator = escapeRegex(idIndexSeparator);
  const escapedPseudoSeparator = escapeRegex(idPseudoSeparator);
  const regExp = new RegExp(
    `^(.+?)($|${escapedIdSeparator}|${escapedPseudoSeparator}|${escapedIndexSeparator})`
  );
  const match = first.match(regExp);
  if (match === null) {
    throw new Error(`Unable to extract ID prefix from "${first}" form data key`);
  }
  return match[1];
}
