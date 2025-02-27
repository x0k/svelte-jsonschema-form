<script lang="ts" module>
  import type { ComponentInternals, ComponentProps, Snippet } from "svelte";

  import type { AnyComponent } from "./svelte.svelte.js";
  import Dynamic from "./dynamic.svelte";

  export interface DynamicOptions<E> {
    fallback?: Snippet;
    onerror?: Snippet<[E]>;
  }

  export function dynamic<C extends AnyComponent, E>(
    loader: () => Promise<{ default: C }>,
    options?: DynamicOptions<E>
  ): C {
    let promise: Promise<Snippet> | undefined;
    return ((internals, props: ComponentProps<C>) =>
      Dynamic(internals, {
        ...options,
        componentPromise: () =>
          (promise ??= loader().then(
            (m) =>
              ((internals: ComponentInternals) => {
                m.default(internals, props);
              }) as unknown as Snippet
          )),
      })) as C;
  }
</script>

<script lang="ts" generics="E">
  const {
    componentPromise,
    fallback,
    onerror,
  }: {
    componentPromise: () => Promise<Snippet>;
    fallback?: Snippet;
    onerror?: Snippet<[E]>;
  } = $props();
</script>

{#await componentPromise()}
  {@render fallback?.()}
{:then component}
  {@render component()}
{:catch e}
  {@render onerror?.(e)}
{/await}
