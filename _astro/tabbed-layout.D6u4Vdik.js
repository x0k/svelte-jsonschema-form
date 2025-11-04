const t=`import type { PathTrieRef } from "@sjsf/form";
import { createContext, type Snippet } from "svelte";

export interface TabsNode {
  readonly tabs: Snippet[];
  selectedTab: number;
}

export type TabsContext = PathTrieRef<TabsNode>;

export const [getTabsContext, setTabsContext] = createContext<TabsContext>();

export function createTabsNode(initialTab: number): TabsNode {
  let selectedTab = $state(initialTab);
  return {
    tabs: [],
    get selectedTab() {
      return selectedTab;
    },
    set selectedTab(v) {
      selectedTab = v;
    },
  };
}
`,e=`<script lang="ts">
  import { isFixedItems } from "@sjsf/form/core";
  import type { ComponentProps } from "@sjsf/form";
  import { getArrayContext } from "@sjsf/form/fields/array/context.svelte";
  import Layout from "@sjsf/basic-theme/components/layout.svelte";

  import Tabs from "./tabs.svelte";
  import Tab from "./tab.svelte";

  const props: ComponentProps["layout"] = $props();

  const arrCtx = getArrayContext();

  const isTuple = $derived(isFixedItems(arrCtx.config().schema));
<\/script>

{#if props.type === "array-items" && isTuple}
  <Tabs {...props} />
{:else if props.type === "array-item" && isTuple}
  <Tab {...props} />
{:else if !(props.type === "array-field-meta" && isTuple)}
  <Layout {...props} />
{/if}
`,n=`import type { Schema } from '@sjsf/form';

export const schema = {
  title: "Multi page form",
  type: "array",
  items: [
    {
      title: "Page 1",
      type: "array",
      items: [
        {
          title: "Page 1.1",
          type: "object",
          properties: {
            label: {
              type: "string",
              title: "Label",
            },
          },
          required: ["label"],
        },
        {
          title: "Page 1.2",
          type: "object",
          properties: {
            otherField: {
              type: "string",
              title: "Other Label",
              minLength: 3,
            },
          },
          required: ["otherField"],
        },
        {
          title: "Page 1.3",
          type: "object",
          properties: {
            number: {
              type: "number",
              title: "Some number",
              minimum: 5,
              maximum: 150,
            },
          },
          required: ["number"],
        },
      ],
    },
    {
      title: "Page 2",
      type: "array",
      items: [
        {
          title: "Page 2.1",
          type: "object",
          properties: {
            label: {
              type: "string",
              title: "Label",
            },
          },
          required: ["label"],
        },
        {
          title: "Page 2.2",
          type: "object",
          properties: {
            otherField: {
              type: "string",
              title: "Other Label",
              minLength: 3,
            },
          },
          required: ["otherField"],
        },
        {
          title: "Page 2.3",
          type: "object",
          properties: {
            number: {
              type: "number",
              title: "Some number",
              minimum: 5,
              maximum: 150,
            },
          },
          required: ["number"],
        },
      ],
    },
  ],
} as const satisfies Schema;
`,s=`<script lang="ts">
  import { insertValue } from "@sjsf/form/lib/trie";
  import {
    getFieldTitle,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  import { createTabsNode, getTabsContext } from "./context.svelte";

  const { config, children }: ComponentProps["layout"] = $props();

  const ctx = getFormContext();
  const tabsCtx = getTabsContext();
  const node = createTabsNode(0);
  tabsCtx.current = insertValue(tabsCtx.current, config.path, node);

  function getTabTitle(i: number): string {
    return getFieldTitle(ctx, config.path.concat(i)) ?? \`Tab \${i + 1}\`;
  }
<\/script>

{@render children()}

<div style="display: flex; gap: 1rem;">
  {#each node.tabs as _, i}
    <button
      style="width: 100%;"
      onclick={(e) => {
        e.preventDefault();
        node.selectedTab = i;
      }}
    >
      {getTabTitle(i)}
      {#if node.selectedTab === i}
        (selected)
      {/if}
    </button>
  {/each}
</div>

{#each node.tabs as tab, i}
  <div style:display={node.selectedTab === i ? "unset" : "none"}>
    {@render tab()}
  </div>
{/each}

<!-- Or render only selected tab -->

<!-- {#if tabs.length > 0}
  {@render tabs[selectedTab]()}
{/if} -->
`,r=`import type { FailureValidationResult, FormState } from "@sjsf/form";
import {
  createFocusOnFirstError,
  type GetFocusableElementOptions,
} from "@sjsf/form/focus-on-first-error";

import type { TabsContext } from "./context.svelte";

export function createTabbedFocusOnFirstError(
  ctx: TabsContext,
  options: GetFocusableElementOptions = {}
) {
  const focus = createFocusOnFirstError(options);
  return (
    result: FailureValidationResult,
    e: SubmitEvent,
    form: FormState<any>
  ) => {
    const { errors } = result;
    if (errors.length === 0) {
      return;
    }
    // NOTE: For simplicity, we will switch to the tab with the first error,
    // although it would be nice to take into account the current tab selection
    const { path } = errors[0];
    let children = ctx.current;
    for (let i = 0; i < path.length && children; i++) {
      const node = children.value;
      if (node !== undefined) {
        node.selectedTab = Number(path[i]);
      }
      children = children.values.get(path[i]);
    }
    return focus(result, e, form);
  };
}
`,o=`<script lang="ts">
  import { getValueByKeys } from "@sjsf/form/lib/trie";
  import type { ComponentProps } from "@sjsf/form";

  import { getTabsContext } from "./context.svelte";

  const { children, config }: ComponentProps["layout"] = $props();
  const tabsCtx = getTabsContext();

  const node = getValueByKeys(tabsCtx.current, config.path.slice(0, -1));
  node?.tabs.push(children);
<\/script>
`,a=`export * from './context.svelte'
export * from './focus'
export * from './schema'
export { default as Layout } from './layout.svelte'
`,i=`<script lang="ts">
  import { overrideByRecord } from "@sjsf/form/lib/resolver";
  import { BasicForm, createForm } from "@sjsf/form";

  import * as defaults from "$lib/form-defaults";
  import {
    Layout,
    createTabbedFocusOnFirstError,
    schema,
    setTabsContext,
    type TabsContext,
  } from "$lib/tabs";

  const tabsCtx: TabsContext = { current: undefined };
  setTabsContext(tabsCtx);

  const theme = overrideByRecord(defaults.theme, {
    layout: Layout,
  });

  const form = createForm({
    ...defaults,
    schema,
    theme,
    onSubmit: console.log,
    onSubmitError: createTabbedFocusOnFirstError(tabsCtx),
  });
<\/script>

<BasicForm {form} novalidate />
`,l=`<script lang="ts">
  import TopTabs from "./top-tabs.svelte";
  import SubTabs from "./sub-tabs.svelte";

  let subTabs = $state.raw(false);

  const Form = $derived(subTabs ? SubTabs : TopTabs);
<\/script>

<label style="display: flex; justify-items: baseline; gap: 0.2rem; padding-block: 1rem" >
  <input type="checkbox" bind:checked={subTabs} />
  Sub tabs
</label>

<Form />
`,c=`<script lang="ts">
  import { BasicForm, createForm, type UiSchemaRoot } from "@sjsf/form";

  import * as defaults from "$lib/form-defaults";
  import {
    Layout,
    createTabbedFocusOnFirstError,
    schema,
    setTabsContext,
    type TabsContext,
  } from "$lib/tabs";

  const uiSchema = {
    "ui:components": {
      layout: Layout,
    },
    items: {
      "ui:components": {
        layout: Layout,
      },
    },
  } satisfies UiSchemaRoot;

  const tabsCtx: TabsContext = { current: undefined };
  setTabsContext(tabsCtx);

  const form = createForm({
    ...defaults,
    schema,
    uiSchema,
    onSubmit: console.log,
    onSubmitError: createTabbedFocusOnFirstError(tabsCtx),
  });
<\/script>

<BasicForm {form} novalidate />
`,b={files:{"src/lib/tabs/context.svelte.ts":t,"src/lib/tabs/layout.svelte":e,"src/lib/tabs/schema.ts":n,"src/lib/tabs/tabs.svelte":s,"src/lib/tabs/focus.ts":r,"src/lib/tabs/tab.svelte":o,"src/lib/tabs/index.ts":a,"src/routes/sub-tabs.svelte":i,"src/routes/+page.svelte":l,"src/routes/top-tabs.svelte":c}};export{b as layer};
