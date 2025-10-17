<script lang="ts" module>
  import "@/fields/extra-templates/optional-field.js";
  import "@/fields/extra-components/title.js";
  import "@/fields/extra-components/label.js";
  import "@/fields/extra-components/description.js";
  import "@/fields/extra-components/errors-list.js";
  import "@/fields/extra-components/help.js";

  import "../field-layouts.js";
</script>

<script lang="ts">
  import { isNil } from "@/lib/types.js";
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
  } from "@/form/index.js";

  import { getTemplateProps } from "../get-template-props.js";

  const templateType = "fieldTemplate";

  const {
    children,
    config,
    uiOption,
    showTitle,
    useLabel,
    errors,
    value,
    action,
  }: ComponentProps[typeof templateType] = $props();

  const ctx = getFormContext();

  const Layout = $derived(getComponent(ctx, "layout", config));
  const TitleOrLabel = $derived(
    getComponent(
      ctx,
      (uiOption("useLabel") ?? useLabel) ? "label" : "title",
      config
    )
  );
  const Description = $derived(getComponent(ctx, "description", config));
  const ErrorsList = $derived(getComponent(ctx, "errorsList", config));
  const Help = $derived(getComponent(ctx, "help", config));

  const { title, description, showMeta } = $derived(
    getTemplateProps(uiOption, config)
  );
  const help = $derived(uiOption("help"));
</script>

<Layout type="field" {config} {errors}>
  {#if showMeta && ((showTitle && title) || description)}
    <Layout type="field-meta" {config} {errors}>
      {#if showTitle && title}
        <Layout type="field-title-row" {config} {errors}>
          <TitleOrLabel {templateType} {title} {config} {errors} />
          {@render action?.()}
        </Layout>
      {/if}
      {#if description}
        <Description {templateType} {description} {config} {errors} />
      {/if}
    </Layout>
  {/if}
  {#if config.required || !isNil(value)}
    <Layout type="field-content" {config} {errors}>
      {@render children()}
    </Layout>
  {/if}
  {#if errors.length > 0}
    <ErrorsList {errors} {config} />
  {/if}
  {#if help !== undefined}
    <Help {help} {config} {errors} />
  {/if}
</Layout>
