<script lang="ts">
  import { identity } from "@sjsf/form/lib/function";
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchemaRoot,
    type AsyncFormValueValidator,
  } from "@sjsf/form";

  import { browser } from "$app/environment";
  import * as defaults from "$lib/form-defaults";

  import { COUNTRIES } from "./countries";
  import AsyncComboboxWidget, {
    type MyAsyncComboboxOptions,
  } from "./async-combobox-widget.svelte";

  async function searchFn(signal: AbortSignal, query: string) {
    const promise = Promise.withResolvers<string[]>();
    const id = setTimeout(
      () =>
        promise.resolve(
          COUNTRIES.filter((c) =>
            c.toLocaleLowerCase().includes(query.toLocaleLowerCase())
          )
        ),
      1000
    );
    const onAbort = () => {
      clearTimeout(id);
      promise.reject(
        new DOMException("The operation was aborted.", "AbortError")
      );
    };
    signal.addEventListener("abort", onAbort);
    return promise.promise.finally(() => {
      signal.removeEventListener("abort", onAbort);
    });
  }

  const schema = {
    type: "string",
    title: "Country",
  } as const satisfies Schema;

  const uiSchema: UiSchemaRoot = {
    "ui:components": {
      textWidget: AsyncComboboxWidget,
    },
    "ui:options": {
      myAsyncComboboxOptions: {
        searchFn,
        getId: identity,
        getLabel: identity,
      } satisfies MyAsyncComboboxOptions<string>,
      translations: {
        get submit(): string {
          return form.submission.isProcessed ? "Validation..." : "Submit";
        },
      },
    },
  };

  const form = createForm({
    ...defaults,
    validator: (options) => {
      const defaultValidator = defaults.validator(options);
      return {
        ...defaultValidator,
        async validateFormValueAsync(signal, rootSchema, formValue) {
          const result = defaultValidator.validateFormValue(
            rootSchema,
            formValue
          );
          if (result.errors) {
            return result;
          }
          if (typeof formValue === "string") {
            const countries = await searchFn(signal, formValue);
            if (countries.includes(formValue)) {
              return {
                value: formValue,
              };
            }
          }
          return {
            value: formValue,
            errors: [
              {
                path: [],
                message: "invalid country",
              },
            ],
          };
        },
      } satisfies AsyncFormValueValidator<string>;
    },
    // NOTE: the behavior of the `$derived` rune during SSR is different from the browser
    get disabled(): boolean {
      return browser && form.submission.isProcessed;
    },
    schema,
    uiSchema,
    onSubmit: console.log,
  });
</script>

<BasicForm {form} />
