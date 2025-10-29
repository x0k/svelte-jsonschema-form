/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAbortSignal, onMount, tick, untrack } from 'svelte';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
import type { DeepPartial } from '@sjsf/form/lib/types';
import { isRecordEmpty } from '@sjsf/form/lib/object';
import {
  DEFAULT_ID_PREFIX,
  isUiSchemaRef,
  resolveUiRef,
  SJSF_ID_PREFIX,
  validate,
  type FormOptions,
  type FormState,
  type UiSchemaRoot
} from '@sjsf/form';

import { FORM_DATA_FILE_PREFIX, JSON_CHUNKS_KEY } from '$lib/model.js';
import { chunks } from '$lib/internal.js';

import { encode } from '../internal/codec.js';
import {
  createSvelteKitDataParser,
  type SvelteKitDataParserOptions
} from '../internal/sveltekit-data-parser.js';

export function createClientValidator<T>(form: FormState<T>) {
  return {
    '~standard': {
      version: 1,
      vendor: 'svelte-jsonschema-form',
      validate(): StandardSchemaV1.Result<void> {
        const result = validate(form);
        if (result.errors) {
          return {
            issues: result.errors
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
  function fileInput(name: string, value: File) {
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
    fileInput(encode(fdKey), value);
    return fdKey;
  };
}

export interface ConnectOptions extends SvelteKitDataParserOptions {
  /** By default, handles conversion of `File` */
  createReplacer?: (formElement: HTMLFormElement) => (key: string, value: any) => any;
  /** @default 500000 */
  jsonChunkSize?: number;
}

type RemoteFieldsContainer = Pick<RemoteForm<any, any>, 'fields'>;

export async function connect<
  T,
  F extends RemoteForm<any, any> | ReturnType<RemoteForm<any, any>['enhance']>
>(
  remoteForm: F,
  options: FormOptions<T> &
    ConnectOptions &
    (F extends RemoteFieldsContainer ? {} : RemoteFieldsContainer)
): Promise<FormOptions<T>> {
  const dataParser = createSvelteKitDataParser(options);

  const idPrefix = $derived(options.idPrefix ?? DEFAULT_ID_PREFIX);

  const fields = $derived.by(() => {
    if ('fields' in remoteForm) {
      return remoteForm.fields;
    } else if ('fields' in options) {
      return options.fields;
    } else {
      throw new Error(
        '`remoteForm.fields` is undefined, if you use `enhance`, pass `fields` through the form options'
      );
    }
  });
  async function getInitialValue() {
    const formValue = fields.value();
    if (isRecordEmpty(formValue)) {
      return undefined;
    }
    return (await dataParser(getAbortSignal(), idPrefix, formValue)) as DeepPartial<T>;
  }
  // svelte-ignore await_waterfall
  const initialValue = $derived(await getInitialValue());

  let formElement: HTMLFormElement;
  let originalFormElement: HTMLFormElement;
  const enhancedRemoteForm =
    'enhance' in remoteForm
      ? remoteForm.enhance(async ({ submit }) => {
          await submit();
          if (fields.allIssues()) {
            return;
          }
          await tick();
          originalFormElement.reset();
        })
      : remoteForm;
  onMount(() => {
    const symbols = Object.getOwnPropertySymbols(enhancedRemoteForm);
    if (symbols.length !== 1) {
      throw new Error(
        `The remote form specification was changed; only one custom symbol was expected, but got "${symbols.length}"`
      );
    }
    formElement = document.createElement('form');
    formElement.style.display = 'none';
    const attach = enhancedRemoteForm[symbols[0]];
    return attach(formElement);
  });

  function hiddenInput(name: string, value: string) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    formElement.append(input);
  }

  const jsonChunkSize = $derived(options.jsonChunkSize ?? 500000);
  const createReplacer = $derived(options.createReplacer ?? createDefaultReplacer);

  const uiSchema: UiSchemaRoot = $derived.by(() => {
    let schema = options.uiSchema;
    return untrack(() => {
      if (isUiSchemaRef(schema)) {
        schema = resolveUiRef(schema, schema);
      }
      if (schema === undefined) {
        return {
          'ui:options': {
            form: {
              get action() {
                return remoteForm.action;
              },
              get method() {
                return remoteForm.method;
              }
            }
          }
        };
      }
      return new Proxy(schema, {
        get(t, p, r) {
          const value = Reflect.get(t, p, r);
          return p === 'ui:options'
            ? new Proxy(value, {
                get(t, p, r) {
                  const value = Reflect.get(t, p, r);
                  return p === 'form'
                    ? new Proxy(value, {
                        get(t, p, r) {
                          switch (p) {
                            case 'action':
                            case 'method':
                              return remoteForm[p];
                            default:
                              return Reflect.get(t, p, r);
                          }
                        }
                      })
                    : value;
                }
              })
            : value;
        }
      });
    });
  });

  return Object.setPrototypeOf(
    {
      get initialValue() {
        return initialValue ?? options.initialValue;
      },
      get initialErrors() {
        return fields.allIssues() ?? options.initialErrors;
      },
      get uiSchema() {
        return uiSchema;
      },
      onSubmit(value, e) {
        if (!(e.target instanceof HTMLFormElement)) {
          throw new Error('HTMLFormElement expected as submit event target');
        }
        originalFormElement = e.target;
        formElement.enctype = originalFormElement.enctype;
        formElement.method = originalFormElement.method;
        formElement.action = originalFormElement.action;
        formElement.target = originalFormElement.target;
        formElement.acceptCharset = originalFormElement.acceptCharset;
        formElement.name = originalFormElement.name;
        formElement.rel = originalFormElement.rel;
        hiddenInput(SJSF_ID_PREFIX, idPrefix);
        for (const chunk of chunks(
          JSON.stringify(value, createReplacer(formElement)),
          jsonChunkSize
        )) {
          hiddenInput(CHUNK_KEY, chunk);
        }
        document.body.appendChild(formElement);
        formElement.requestSubmit();
        formElement.remove();
        formElement.replaceChildren();
        options.onSubmit?.(value, e);
      }
    } satisfies Partial<FormOptions<T>>,
    options
  );
}
