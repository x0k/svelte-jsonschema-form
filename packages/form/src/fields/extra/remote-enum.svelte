<script lang="ts" module>
  import { getContext, hasContext, setContext } from "svelte";

  import type { Query } from "@/lib/task.svelte.js";
  import type { EnumOption } from "@/core/index.js";
  import {
    type Config,
    type FormState,
    retrieveUiOption,
  } from "@/form/index.js";

  const field = "remoteEnumField";
  export interface EnumOptionsQueries {}

  declare module "../../form/index.js" {
    interface ActionFields {
      [field]: {};
    }
    interface UiOptions {
      enumOptionsQuery?: keyof EnumOptionsQueries;
    }
  }

  export type EnumOptionsQueriesContext = EnumOptionsQueries & {
    [k: string]: Query<any, EnumOption<SchemaValue>[], any>;
  };

  const QUERIES_CONTEXT_KEY = Symbol("queries-context-key");

  export function getEnumOptionsQueriesContext(): EnumOptionsQueriesContext {
    if (!hasContext(QUERIES_CONTEXT_KEY)) {
      throw new Error(`enum options queries context is missing`);
    }
    return getContext(QUERIES_CONTEXT_KEY);
  }

  export function setEnumOptionsQueriesContext(ctx: EnumOptionsQueries) {
    setContext(QUERIES_CONTEXT_KEY, ctx);
  }

  export function getEnumOptionsQueryKey<T>(ctx: FormState<T>, config: Config) {
    const key = retrieveUiOption(ctx, config, "enumOptionsQuery");
    if (key === undefined) {
      throw new Error(
        `${config.path.join(".")}: 'enumOptionsQuery' UI option is undefined`
      );
    }
    return key;
  }

  export function getEnumOptionsQuery<K extends keyof EnumOptionsQueries>(
    queries: EnumOptionsQueriesContext,
    key: K
  ) {
    const query = queries[key];
    if (query === undefined) {
      throw new Error(`query "${key}" not found`);
    }
    return query;
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    type ComponentProps,
    type SchemaValue,
    type FormEnumOption,
    getFieldErrors,
    getFieldAction,
    getComponent,
    makeEventHandlers,
    validateField,
  } from "@/form/index.js";
  import "@/form/extra-fields/remote-enum.js";
  import {
    EMPTY_VALUE,
    IdEnumValueMapperBuilder,
    singleOption,
  } from "@/options.svelte.js";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps[typeof field] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "selectWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(
    ctx,
    () => config,
    () => validateField(ctx, config, value)
  );

  const queryKey = $derived(getEnumOptionsQueryKey(ctx, config));
  const queries = getEnumOptionsQueriesContext();
  const query = $derived(getEnumOptionsQuery(queries, queryKey));
  let remoteOptions = $derived(query.result ?? []);

  const { options, mapper } = $derived.by(() => {
    const builder =
      uiOption("enumValueMapperBuilder")?.() ?? new IdEnumValueMapperBuilder();
    const options: FormEnumOption[] = remoteOptions.map((o) => ({
      ...o,
      mappedValue: builder.push(o),
    }));
    return { options, mapper: builder.build() };
  });
  const mapped = singleOption({
    mapper: () => mapper,
    value: () => value,
    update: (v) => (value = v),
  });
  const clearable = $derived(
    uiOption("clearable") ??
      (!config.required && mapper.toValue(EMPTY_VALUE) === undefined)
  );
  const errors = $derived(getFieldErrors(ctx, config.path));
  const action = $derived(getFieldAction(ctx, config, field));
</script>

{#snippet renderAction()}
  {@render action?.(
    ctx,
    config,
    {
      get current() {
        return value;
      },
      set current(v) {
        value = v;
      },
    },
    errors
  )}
{/snippet}
<Template
  type="template"
  showTitle
  useLabel
  {uiOption}
  {widgetType}
  {value}
  {config}
  {errors}
  action={action && renderAction}
>
  <Widget
    type="widget"
    {handlers}
    {config}
    {errors}
    {uiOption}
    bind:value
    {options}
    {mapper}
    {mapped}
    {clearable}
    hasInitialValue={!clearable}
  />
</Template>
