<script lang="ts">
  import { identity } from "@sjsf/form/lib/function";
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchemaRoot,
  } from "@sjsf/form";

  import { browser } from "$app/environment";
  import * as defaults from "$lib/form-defaults";

  import { COUNTRIES } from "./countries";
  import AsyncComboboxWidget, {
    type MyAsyncComboboxOptions,
  } from "./async-combobox-widget.svelte";

  async function searchFn(_: AbortSignal, query: string) {
    await new Promise((r) => setTimeout(r, 1000));
    return COUNTRIES.filter((c) =>
      c.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    );
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
      const defaultValidator = defaults.validator<string>(options);
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
      };
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
