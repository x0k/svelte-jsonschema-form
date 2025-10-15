<script lang="ts" module>
  import "@/fields/extra-components/title.js";
  import "@/fields/extra-components/label.js";
  import "@/fields/extra-components/description.js";
  import "@/fields/extra-components/errors-list.js";
  import "@/fields/extra-components/help.js";
  declare module "../fields/components.js" {
    interface LayoutTypes {
      field: {};
      "field-meta": {};
      "field-content": {};
    }
  }
</script>

<script lang="ts">
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
  } from "@/form/index.js";

  import { getTemplateProps } from "./get-template-props.js";

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

  const { title, description, showMeta, hideContent } = $derived(
    getTemplateProps(uiOption, config)
  );
  const help = $derived(uiOption("help"));
</script>

<Layout type="field" {config} {errors}>
  {#if showMeta && ((showTitle && title) || description)}
    <Layout type="field-meta" {config} {errors}>
      {#if showTitle && title}
        <TitleOrLabel
          {templateType}
          {title}
          {config}
          {errors}
          append={action}
        />
      {/if}
      {#if description}
        <Description {templateType} {description} {config} {errors} />
      {/if}
    </Layout>
  {/if}
  {#if !hideContent?.(config, value)}
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
