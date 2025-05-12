<script lang="ts" generics="T extends string">
  import type { Snippet } from "svelte";
  import type { HTMLDetailsAttributes } from "svelte/elements";

  interface Props extends HTMLDetailsAttributes {
    value: T;
    options: T[];
    label?: Snippet<[T]>;
    preLabel?: Snippet<[T]>;
    postLabel?: Snippet<[T]>;
  }

  let {
    value = $bindable(),
    options,
    label,
    preLabel,
    postLabel,
    children,
    class: className,
    ...rest
  }: Props = $props();

  let detailsElement: HTMLDetailsElement;

  $effect(() => {
    const handler = (event: MouseEvent) => {
      const withinBoundaries = event.composedPath().includes(detailsElement);
      if (!withinBoundaries) {
        detailsElement.open = false;
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  });
</script>

<details bind:this={detailsElement} {...rest} class={["dropdown", className]}>
  <summary class="btn btn-sm btn-ghost font-normal min-w-24">
    {#if label}
      {@render label(value)}
    {:else}
      {value}
    {/if}
  </summary>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    tabindex="0"
    class="dropdown-content bg-base-200 text-base-content rounded-box max-h-[calc(100vh-10rem)] overflow-y-auto border border-white/5 shadow-2xl outline-1 outline-black/5"
  >
    <ul class="menu menu-sm gap-1">
      {#each options as option (option)}
        <li>
          <button
            class={["group", value === option && "menu-active"]}
            onclick={() => {
              value = option;
              detailsElement.open = false;
            }}
          >
            <!-- {#if $t("__code", {}, option, false) !== "__code"}
              <span
                class="badge badge-sm badge-outline !pl-1.5 !pr-1 pt-px font-mono !text-[.6rem] font-bold tracking-widest opacity-50">
                {$t("__code", {}, option)}
              </span>
            {/if} -->
            {#if preLabel}
              {@render preLabel(option)}
            {/if}
            <span class="font-[sans-serif]">
              {#if label}
                {@render label(option)}
              {:else}
                {option}
              {/if}
            </span>
            {#if postLabel}
              {@render postLabel(option)}
            {/if}
            <!-- {#if $t("__status", {}, option) !== "__status" && $t("__status", {}, option) !== ""}
              <span class="badge badge-sm badge-ghost">
                {$t("__status", {}, option)}
              </span>
            {/if} -->
          </button>
        </li>
      {/each}
      {@render children?.()}
    </ul>
  </div>
</details>
