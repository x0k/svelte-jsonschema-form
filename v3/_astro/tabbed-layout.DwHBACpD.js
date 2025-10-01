const t=`import type { Id } from '@sjsf/form'
import { getContext, setContext, type Snippet } from 'svelte'

export interface TabsNode {
  readonly children: TabsContext
  readonly tabs: Snippet[]
  selectedTab: number
}

export type TabsContext = Map<Id, TabsNode>

const TABS_CONTEXT = Symbol()

export function getTabsContext(): TabsContext {
  return getContext(TABS_CONTEXT)
}

export function setTabsContext(ctx: TabsContext) {
  setContext(TABS_CONTEXT, ctx)
}

const TABS_NODE_CONTEXT = Symbol()

export function getTabsNodeContext(): TabsNode {
  return getContext(TABS_NODE_CONTEXT)
}

export function setTabsNodeContext(ctx: TabsNode) {
  setContext(TABS_NODE_CONTEXT, ctx)
}

export function createTabsNode(initialTab: number): TabsNode {
  let selectedTab = $state(initialTab)
  return {
    children: new Map(),
    tabs: [],
    get selectedTab() {
      return selectedTab
    },
    set selectedTab(v) {
      selectedTab = v
    }
  }
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
`,o=`<script lang="ts">
  import { isSchemaObject } from "@sjsf/form/lib/json-schema";
  import { createId, getFormContext, type ComponentProps } from "@sjsf/form";

  import {
    createTabsNode,
    getTabsContext,
    setTabsContext,
    setTabsNodeContext,
  } from "./context.svelte";

  const { config, children }: ComponentProps["layout"] = $props();

  const ctx = getFormContext()
  const tabsCtx = getTabsContext();
  const node = createTabsNode(0);
  tabsCtx.set(createId(ctx, config.path), node);
  setTabsContext(node.children);
  setTabsNodeContext(node);

  function getTabTitle(i: number): string {
    // TODO: handle \`config.uiSchema\`
    const { items } = config.schema;
    if (Array.isArray(items)) {
      const item = items[i];
      if (isSchemaObject(item) && item.title) {
        return item.title
      }
    }
    return \`Tab \${i + 1}\`;
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
`,s=`import {
  createIdByPath,
  type FormState,
  type FormValue,
  type ValidationError,
} from "@sjsf/form";
import {
  createFocusOnFirstError,
  type GetFocusableElementOptions,
} from "@sjsf/form/focus-on-first-error";

import type { TabsContext } from "./context.svelte";

export function createTabbedFocusOnFirstError<E>(
  ctx: TabsContext,
  options: GetFocusableElementOptions = {}
) {
  const focus = createFocusOnFirstError(options);
  return (
    errors: ValidationError[],
    e: SubmitEvent,
    snap: FormValue,
    form: FormState<any>
  ) => {
    if (errors.length === 0) {
      return;
    }
    // NOTE: For simplicity, we will switch to the tab with the first error,
    // although it would be nice to take into account the current tab selection
    const { path } = errors[0];
    let children = ctx;
    for (let i = 0; i < path.length && children.size; i++) {
      const id = createIdByPath(form, path.slice(0, i));
      const node = children.get(id);
      if (node === undefined) {
        continue;
      }
      node.selectedTab = Number(path[i]);
      children = node.children;
    }
    return focus(errors, e, snap, form);
  };
}
`,r=`<script lang="ts">
  import type { ComponentProps } from '@sjsf/form';
  
  import { getTabsNodeContext } from './context.svelte';

  const { children }: ComponentProps["layout"] = $props();
  const node = getTabsNodeContext()

  node.tabs.push(children)
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

  const tabsCtx: TabsContext = new Map();
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
`,c=`<script lang="ts">
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
`,l=`<script lang="ts">
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

  const tabsCtx: TabsContext = new Map();
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
`,m={files:{"src/lib/tabs/context.svelte.ts":t,"src/lib/tabs/layout.svelte":e,"src/lib/tabs/schema.ts":n,"src/lib/tabs/tabs.svelte":o,"src/lib/tabs/focus.ts":s,"src/lib/tabs/tab.svelte":r,"src/lib/tabs/index.ts":a,"src/routes/sub-tabs.svelte":i,"src/routes/+page.svelte":c,"src/routes/top-tabs.svelte":l}};export{m as layer};
