<script lang="ts">
  import {
    Content,
    createForm,
    Form,
    setFormContext,
    SubmitButton,
  } from "@sjsf/form";
  import { createTask } from "@sjsf/form/lib/task.svelte";
  import "@sjsf/basic-theme/extra-widgets/radio-include";

  import * as defaults from "@/lib/form/defaults";

  let data = $state<string>();

  interface Config {
    reject: boolean;
    delay: number;
    value: string;
  }

  const resolve = createTask({
    execute: (_signal, { reject: isError, delay, value }: Config) =>
      new Promise<string>((resolve, reject) => {
        data = undefined;
        setTimeout(() => {
          if (isError) {
            reject(value);
          } else {
            resolve(value);
          }
        }, delay);
      }),
    onSuccess(response: string) {
      data = response;
    },
    onFailure: console.error,
    delayedMs: 500,
    timeoutMs: 2000,
  });

  const form = createForm<Config>({
    ...defaults,
    schema: {
      properties: {
        delay: {
          type: "integer",
          enum: [250, 1500, 2500],
          default: 1500,
        },
        reject: {
          type: "boolean",
        },
        value: {
          type: "string",
        },
      },
    },
    uiSchema: {
      delay: {
        "ui:components": {
          integerField: "enumField",
          selectWidget: "radioWidget",
        },
        "ui:options": {
          enumNames: ["250ms", "1.5s", "2.5s"],
        },
      },
      "ui:options": {
        translations: {
          get submit() {
            return resolve.isDelayed ? "Processed..." : "Submit";
          },
        },
      },
    },
    onSubmit: resolve.run,
    get disabled() {
      return resolve.isProcessed;
    },
  });
  setFormContext(form);
</script>

<Form>
  <Content />
  <SubmitButton />
  {#if data !== undefined}
    <p>Data: {data}</p>
  {/if}
  {#if resolve.matches("failed")}
    <p class="text-red-500">Failed: {resolve.state.reason}</p>
  {/if}
</Form>
