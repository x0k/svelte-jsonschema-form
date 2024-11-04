<script lang="ts">
  import { FormContent, SubmitButton } from "@sjsf/form";
  import { Status, useMutation } from "@sjsf/form/use-mutation.svelte";

  import { useCustomForm } from "@/components/custom-form";

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

  const form = useCustomForm({
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
    onSubmit(config: Config | undefined) {
      if (!config) return;
      mutation.run(config);
    },
    get disabled() {
      return mutation.isProcessed;
    },
  });
</script>

<form use:form.enhance style="display: flex; flex-direction: column; gap: 1rem">
  <FormContent bind:value={form.formValue} />
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
</form>
