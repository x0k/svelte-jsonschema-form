<script lang="ts">
  import { identity } from "@sjsf/form/lib/function";
  import { themeOrSubThemeTitle, validatorTitle } from "meta";
  import { createComposer, type CodeTransformer } from "meta/composer";
  import {
    codegenThemeOrSubTheme,
    type CodegenThemeOrSubTheme,
    type CodegenValidator,
  } from "meta/codegen";
  import {
    sandboxOpen,
    SandboxPlatform,
    SANDBOX_PLATFORMS,
  } from "meta/sandbox";

  import {
    EXAMPLE_LAYERS,
    GENERIC_EXAMPLES,
    SVELTE_KIT_EXAMPLES,
    VALIDATOR_SPECIFIC_EXAMPLE_VALIDATORS,
    VALIDATOR_SPECIFIC_EXAMPLES,
    nonPrecompiledValidators,
    type Example,
  } from "@/shared";

  import Buttons from "./buttons.svelte";

  const VALIDATOR_TRANSFORMERS: Partial<
    Record<CodegenValidator, () => Promise<{ default: CodeTransformer }>>
  > = {
    zod4: () => import("meta/schema-transformers/schema-to-zod"),
    valibot: () => import("meta/schema-transformers/schema-to-valibot"),
  };

  let platform: SandboxPlatform = $state.raw(SandboxPlatform.StackBlitz);
  let theme: CodegenThemeOrSubTheme = $state.raw("basic");
  let validator: CodegenValidator = $state.raw("ajv8");

  async function openExample(
    example: Example,
    validatorOverride: CodegenValidator | undefined
  ) {
    const effectiveValidator = validatorOverride ?? validator;
    const { default: exampleContent } = await EXAMPLE_LAYERS[example]();

    const codeTransformers: CodeTransformer[] = [
      ...exampleContent.codeTransformers,
    ];
    const validatorTransformer = VALIDATOR_TRANSFORMERS[effectiveValidator]?.();
    if (validatorTransformer) {
      codeTransformers.push((await validatorTransformer).default);
    }

    const files = createComposer({
      name: example,
      language: "ts",
      themeOrSubTheme: theme,
      icons: "none",
      validatorWithSuffix: effectiveValidator,
      sveltekit: exampleContent.sveltekit,
      extraFiles: exampleContent.files,
      extraDependencies: exampleContent.dependencies,
      codeTransformers,
    });

    await sandboxOpen({ name: example, platform, files });
  }
</script>

<div class="pickers">
  <button style="display: none;">Avoid starlight styles pollution</button>
  <label>
    <span>Platform</span>
    <select bind:value={platform}>
      {#each SANDBOX_PLATFORMS as v (v)}
        <option value={v}>
          {v}
        </option>
      {/each}
    </select>
  </label>
  <label>
    <span>Validator</span>
    <select bind:value={validator}>
      {#each nonPrecompiledValidators() as v (v)}
        <option value={v}>
          {validatorTitle(v)}
        </option>
      {/each}
    </select>
  </label>
  <label>
    <span>Theme</span>
    <select bind:value={theme}>
      {#each codegenThemeOrSubTheme() as t (t)}
        <option value={t}>
          {themeOrSubThemeTitle(t)}
        </option>
      {/each}
    </select>
  </label>
</div>

<h3>Generic</h3>

<Buttons
  items={GENERIC_EXAMPLES}
  onClick={(example) => {
    openExample(example, undefined);
  }}
  label={identity}
/>

<h3>SvelteKit</h3>

<Buttons
  items={SVELTE_KIT_EXAMPLES}
  onClick={(example) => {
    openExample(example, undefined);
  }}
  label={identity}
/>

<h3>Validator specific</h3>
<p><em>Validator selector will be ignored</em></p>

<Buttons
  items={VALIDATOR_SPECIFIC_EXAMPLES}
  onClick={(example) => {
    openExample(example, VALIDATOR_SPECIFIC_EXAMPLE_VALIDATORS[example]);
  }}
  label={identity}
/>

<style>
  .pickers {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    column-gap: 2rem;
    & select {
      width: 100%;
      background-color: var(--sl-color-bg);
      padding: 0.5rem;
      border-radius: 0.5rem;
      color: inherit;
      /* appearance: none; */
    }
  }
</style>
