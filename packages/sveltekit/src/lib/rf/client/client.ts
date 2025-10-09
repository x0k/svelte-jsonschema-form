/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAttachmentKey } from 'svelte/attachments';
import type { HTMLFormAttributes } from 'svelte/elements';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
import { getFormContext, SJSF_ID_PREFIX, validate, type FormState } from '@sjsf/form';
import { FORM_ID_PREFIX } from '@sjsf/form/internals';

import { FORM_DATA_FILE_PREFIX, JSON_CHUNKS_KEY } from '$lib/model.js';
import { chunks } from '$lib/internal.js';

import { encode } from '../internal/codec.js';

export function createClientValidator<T>(form: FormState<T>) {
  return {
    '~standard': {
      version: 1,
      vendor: 'svelte-jsonschema-form',
      validate(): StandardSchemaV1.Result<void> {
        const issues = validate(form);
        if (issues.length > 0) {
          return {
            issues
          };
        }
        return {
          value: undefined
        };
      }
    }
  } satisfies StandardSchemaV1<RemoteFormInput, void>;
}

export interface EnhanceOptions {
  /** Pass this options if context is unavailable */
  form?: FormState<any>;
  /** By default, handles conversion of `File` */
  createReplacer?: (formElement: HTMLFormElement) => (key: string, value: any) => any;
  /** @default 500000 */
  jsonChunkSize?: number;
}

const CHUNK_KEY = `${JSON_CHUNKS_KEY}[]`;

function createDefaultReplacer(formElement: HTMLFormElement) {
  const seen = new Set<string>();
  function file(name: string, value: File) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.name = name;
    const dt = new DataTransfer();
    dt.items.add(value);
    fileInput.files = dt.files;
    formElement.appendChild(fileInput);
  }
  return (key: string, value: any) => {
    if (!(value instanceof File)) {
      return value;
    }
    const initialKey = `${FORM_DATA_FILE_PREFIX}${key}`;
    let fdKey = initialKey;
    let i = 1;
    while (seen.has(fdKey)) fdKey = `${initialKey}__${i++}`;
    file(encode(fdKey), value);
    return fdKey;
  };
}

export function enhance(
  remoteForm: RemoteForm<any, any>,
  { form, createReplacer = createDefaultReplacer, jsonChunkSize = 500000 }: EnhanceOptions = {}
) {
  let formElement: HTMLFormElement;
  function text(name: string, value: string) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    formElement!.append(input);
  }
  return {
    onsubmit: (e) => {
      e.preventDefault();
      text(SJSF_ID_PREFIX, form![FORM_ID_PREFIX]);
      for (const chunk of chunks(
        JSON.stringify(form!.value, createReplacer(formElement!)),
        jsonChunkSize
      )) {
        text(CHUNK_KEY, chunk);
      }
      document.body.appendChild(formElement!);
      formElement!.requestSubmit();
      formElement!.remove();
      formElement!.replaceChildren();
    },
    [createAttachmentKey()]: (originalFormElement) => {
      form ??= getFormContext();
      if (!form) {
        throw new Error(
          `Form context is undefined, specify the 'form' option or set the form context`
        );
      }
      const symbols = Object.getOwnPropertySymbols(remoteForm);
      if (symbols.length !== 1) {
        throw new Error(
          `The remote form specification was changed; only one custom symbol was expected, but got "${symbols.length}"`
        );
      }
      formElement = document.createElement('form');
      formElement.style.display = 'none';
      formElement.enctype = originalFormElement.enctype;
      formElement.method = originalFormElement.method;
      formElement.action = originalFormElement.action;
      formElement.target = originalFormElement.target;
      formElement.acceptCharset = originalFormElement.acceptCharset;
      formElement.name = originalFormElement.name;
      formElement.rel = originalFormElement.rel;
      const attach = remoteForm[symbols[0]];
      return attach(formElement);
    },
    method: remoteForm.method,
    action: remoteForm.action
  } satisfies HTMLFormAttributes;
}
