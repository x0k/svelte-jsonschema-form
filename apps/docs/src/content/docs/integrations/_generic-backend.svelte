<script lang="ts">
  import { FormContent, SubmitButton } from "@sjsf/form";
  import { Status, useAction } from "@sjsf/form/use-action.svelte";

  import { useCustomForm } from "@/components/custom-form";

  let isError = $state(false);
  let duration = $state(0);
  let data = $state<string>();

  const action = useAction({
    do: (_signal, value: string | undefined = "") =>
      new Promise<string>((resolve, reject) => {
        data = undefined;
        isError = Math.random() > 0.5;
        duration = Math.random() * 5000;
        setTimeout(() => {
          if (isError) {
            reject(value);
          } else {
            resolve(value);
          }
        }, duration);
      }),
    onSuccess(response) {
      data = response;
      form.reset();
    },
    onFailure: console.error,
    delayedMs: 1000,
    timeoutMs: 3000,
  });

  const form = useCustomForm({
    schema: {
      type: "string",
    },
    onSubmit: action.run,
    get disabled() {
      return action.isProcessed;
    },
  });
</script>

<p>
  Reject: {isError}, delay: {(duration / 1000).toFixed(2)}sec
</p>

<form use:form.enhance style="display: flex; flex-direction: column; gap: 1rem">
  <FormContent bind:value={form.formValue} />
  {#if action.isDelayed}
    <button style="padding: 0.5rem;" disabled>Processed...</button>
  {:else}
    <SubmitButton />
  {/if}
  {#if data !== undefined}
    <p>Data: {data}</p>
  {/if}
  {#if action.state.status === Status.Failed}
    <p class="text-red-500">Failed: {action.state.reason}</p>
  {/if}
</form>
