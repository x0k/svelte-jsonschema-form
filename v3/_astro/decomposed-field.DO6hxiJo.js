const e=`<script lang="ts">
  import {
    type Schema,
    createForm,
    Field,
    getFieldErrors,
    getFormContext,
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
<\/script>

<Field {form} path={["hello"]}>
  {#snippet render({ config, uiOption, valueRef })}
    <!-- NOTE: form === ctx -->
    {@const ctx = getFormContext()}
    <!--
      NOTE: We use the \`theme\` call because the example needs to be generic,
      but you can use importing a component directly from your theme, for example:
      \`import Layout from '@sjsf/basic-theme/components/layout.svelte'\`
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
    {@const errors = getFieldErrors(ctx, config.path)}
    {@const help = uiOption("help")}
    {@const Widget = t("textWidget", config)}
    {@const handlers = makeEventHandlers(
      ctx,
      () => config,
      () => validateField(ctx, config, valueRef.current)
    )}
    {@const templateType = "fieldTemplate"}
    <Layout type="field" {config} {errors}>
      {#if showMeta && (title || description)}
        <Layout type="field-meta" {config} {errors}>
          {#if title}
            <TitleOrLabel {templateType} {title} {config} {errors} />
          {/if}
          {#if description}
            <Description {templateType} {description} {config} {errors} />
          {/if}
        </Layout>
      {/if}
      <Layout type="field-content" {config} {errors}>
        <Widget
          type="widget"
          bind:value={
            () => valueRef.current as undefined,
            (v) => (valueRef.current = v || uiOption("stringEmptyValue"))
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
`,n={files:{"src/routes/+page.svelte":e}};export{n as layer};
