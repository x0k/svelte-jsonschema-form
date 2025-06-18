<script lang="ts">
  import {
    type FormInternalContext,
    type Schema,
    createForm,
    Field,
    getErrors,
    makeEventHandlers,
    validateField,
  } from "@sjsf/form";
  import { getTemplateProps } from "@sjsf/form/templates/get-template-props";

  import * as defaults from "$lib/form-defaults";

  const schema = {
    type: "object",
    title: "Basic form",
    properties: {
      hello: {
        title: "Title",
        description: "Description",
        type: "string",
      },
    },
    required: ["hello"],
  } as const satisfies Schema;

  const form = createForm({
    ...defaults,
    schema,
    onSubmit: console.log,
  });

  const t = defaults.theme;
  const ctx = form.context as FormInternalContext<typeof defaults.validator>;
</script>

<Field {form} name="hello">
  {#snippet render({ config, uiOption, valueRef })}
    <!--
      NOTE: We use the `theme` call because the example needs to be generic,
      but you can use importing a component directly from your theme, for example:
      `import Layout from '@sjsf/basic-theme/components/layout.svelte'`
    -->
    {@const Layout = t("layout", config)}
    {@const TitleOrLabel = t(
      (uiOption("useLabel") ?? true) ? "label" : "title",
      config
    )}
    {@const Description = t("description", config)}
    {@const ErrorsList = t("errorsList", config)}
    {@const Help = t("help", config)}
    {@const { title, description, showMeta } = getTemplateProps(
      uiOption,
      config
    )}
    {@const errors = getErrors(ctx, config.id)}
    {@const help = uiOption("help")}
    {@const Widget = t("textWidget", config)}
    {@const handlers = makeEventHandlers(ctx, () =>
      validateField(ctx, config, valueRef.value)
    )}
    <Layout type="field" {config} {errors}>
      {#if showMeta && (title || description)}
        <Layout type="field-meta" {config} {errors}>
          {#if title}
            <TitleOrLabel type="field" {title} {config} {errors} />
          {/if}
          {#if description}
            <Description type="field" {description} {config} {errors} />
          {/if}
        </Layout>
      {/if}
      <Layout type="field-content" {config} {errors}>
        <Widget
          type="widget"
          bind:value={
            () => valueRef.value as undefined,
            (v) => (valueRef.value = v || uiOption("stringEmptyValue"))
          }
          {config}
          {errors}
          {handlers}
          {uiOption}
        />
      </Layout>
      {#if errors.length > 0}
        <ErrorsList {errors} {config} />
      {/if}
      {#if help !== undefined}
        <Help {help} {config} {errors} />
      {/if}
    </Layout>
  {/snippet}
</Field>

<pre>
  <code>{JSON.stringify(form.value, null, 2)}</code>
</pre>
