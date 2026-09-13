import type { FormOptions, FormState } from "@sjsf/form";
import type { RemoteForm } from "@sveltejs/kit";

import type { SvelteKitDataParserOptions } from "../internal/sveltekit-data-parser.js";

const STUB_ERROR =
  "@sjsf/sveltekit is stubbed until the sveltekit3 package is available";

export function createClientValidator<T>(form: FormState<T>) {
  void form;
  throw new Error(STUB_ERROR);
}

export interface ConnectOptions extends SvelteKitDataParserOptions {
  /** By default, handles conversion of `File` */
  createReplacer?: (
    formElement: HTMLFormElement
  ) => (key: string, value: any) => any;
  /** @default 500000 */
  jsonChunkSize?: number;
}

export async function connect<T>(
  remoteForm: RemoteForm<any, any>,
  options: FormOptions<T> & ConnectOptions
): Promise<FormOptions<T>> {
  void remoteForm;
  void options;
  throw new Error(STUB_ERROR);
}
