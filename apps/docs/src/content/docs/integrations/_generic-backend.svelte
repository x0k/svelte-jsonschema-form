<script lang="ts">
  import { Content, FormElement, setFromContext, SubmitButton } from "@sjsf/form";
  import { Status, useMutation } from "@sjsf/form/use-mutation.svelte";

  import { createCustomForm } from "@/components/custom-form";

  let data = $state<string>();

  interface Config {
    reject: boolean;
    delay: number;
    value: string;
  }

  const mutation = useMutation({
    mutate: (_signal, { reject: isError, delay, value }: Config) =>
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
    onSuccess(response) {
      data = response;
    },
    onFailure: console.error,
    delayedMs: 500,
    timeoutMs: 2000,
  });

  const form = createCustomForm({
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
        "ui:widget": "radio",
        "ui:options": {
          enumNames: ["250ms", "1.5s", "2.5s"],
        },
      },
    },
    onSubmit: mutation.run,
    get disabled() {
      return mutation.isProcessed;
    },
  });
  setFromContext(form.context)
</script>

<FormElement {form}>
  <Content {form} />
  {#if mutation.isDelayed}
    <button style="padding: 0.5rem;" disabled>Processed...</button>
  {:else}
    <SubmitButton />
  {/if}
  {#if data !== undefined}
    <p>Data: {data}</p>
  {/if}
  {#if mutation.state.status === Status.Failed}
    <p class="text-red-500">Failed: {mutation.state.reason}</p>
  {/if}
</FormElement>
