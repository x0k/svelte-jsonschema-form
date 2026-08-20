import{r as e}from"./rolldown-runtime.C0FnF6B9.js";import{a as t,i as n,n as r,r as i}from"./model.DA5oU76I.js";var a=`import type { PathTrieRef } from "@sjsf/form";
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
`,o=`import type { FailureValidationResult, FormState } from "@sjsf/form";
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
`,s=`export * from "./context.svelte";
export * from "./focus";
export * from "./schema";
export { default as Layout } from "./layout.svelte";
`,c=`<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";
  import { isFixedItems } from "@sjsf/form/core";
  import { getArrayContext } from "@sjsf/form/fields/array/context.svelte";

  import { theme } from "../sjsf/defaults";
  import Tab from "./tab.svelte";
  import Tabs from "./tabs.svelte";

  const props: ComponentProps["layout"] = $props();

  const arrCtx = getArrayContext();

  const isTuple = $derived(isFixedItems(arrCtx.config().schema));

  const Layout = $derived(theme("layout", props.config));
<\/script>

{#if props.type === "array-items" && isTuple}
  <Tabs {...props} />
{:else if props.type === "array-item" && isTuple}
  <Tab {...props} />
{:else if !(props.type === "array-field-meta" && isTuple)}
  <Layout {...props} />
{/if}
`,l=`import type { Schema } from "@sjsf/form";

export const schema = {
  title: "Employee Onboarding",
  type: "array",
  items: [
    {
      title: "Personal Information",
      type: "array",
      items: [
        {
          title: "Basic Details",
          type: "object",
          properties: {
            firstName: {
              type: "string",
              title: "First Name",
            },
            lastName: {
              type: "string",
              title: "Last Name",
            },
            dateOfBirth: {
              type: "string",
              title: "Date of Birth",
              format: "date",
            },
          },
          required: ["firstName", "lastName"],
        },
        {
          title: "Contact",
          type: "object",
          properties: {
            email: {
              type: "string",
              title: "Email",
              format: "email",
            },
            phone: {
              type: "string",
              title: "Phone Number",
            },
          },
          required: ["email"],
        },
        {
          title: "Address",
          type: "object",
          properties: {
            street: {
              type: "string",
              title: "Street",
            },
            city: {
              type: "string",
              title: "City",
            },
            state: {
              type: "string",
              title: "State",
            },
            zipCode: {
              type: "string",
              title: "ZIP Code",
              pattern: "^[0-9]{5}(-[0-9]{4})?$",
            },
          },
        },
      ],
    },
    {
      title: "Employment",
      type: "array",
      items: [
        {
          title: "Position",
          type: "object",
          properties: {
            department: {
              type: "string",
              title: "Department",
              enum: ["Engineering", "Marketing", "Sales", "HR", "Finance"],
            },
            jobTitle: {
              type: "string",
              title: "Job Title",
            },
            employmentType: {
              type: "string",
              title: "Employment Type",
              enum: ["Full-time", "Part-time", "Contract"],
            },
          },
          required: ["jobTitle"],
        },
        {
          title: "Compensation",
          type: "object",
          properties: {
            salary: {
              type: "number",
              title: "Annual Salary",
              minimum: 30000,
              maximum: 200000,
            },
            startDate: {
              type: "string",
              title: "Start Date",
              format: "date",
            },
          },
          required: ["salary"],
        },
        {
          title: "Benefits",
          type: "object",
          properties: {
            healthInsurance: {
              type: "boolean",
              title: "Health Insurance",
            },
            retirementPlan: {
              type: "string",
              title: "Retirement Plan",
              enum: ["401k", "IRA", "None"],
            },
          },
        },
      ],
    },
  ],
} as const satisfies Schema;
`,u=`<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";
  import { getValueByKeys } from "@sjsf/form/lib/trie";

  import { getTabsContext } from "./context.svelte";

  const { children, config }: ComponentProps["layout"] = $props();
  const tabsCtx = getTabsContext();

  const node = getValueByKeys(tabsCtx.current, config.path.slice(0, -1));
  node?.tabs.push(children);
<\/script>
`,d=`<script lang="ts">
  import {
    getFieldTitle,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";
  import { insertValue } from "@sjsf/form/lib/trie";

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
`,f=`<script lang="ts">
  import SubTabs from "./sub-tabs.svelte";
  import TopTabs from "./top-tabs.svelte";

  let subTabs = $state.raw(false);

  const Form = $derived(subTabs ? SubTabs : TopTabs);
<\/script>

<label
  style="display: flex; justify-items: baseline; gap: 0.2rem; padding-block: 1rem"
>
  <input type="checkbox" bind:checked={subTabs} />
  Sub tabs
</label>

<Form />
`,p=`<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { overrideByRecord } from "@sjsf/form/lib/resolver";
  import { resolver } from "@sjsf/form/resolvers/compat";

  import * as defaults from "$lib/sjsf/defaults";
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
    resolver,
    schema,
    theme,
    onSubmit: console.log,
    onSubmitError: createTabbedFocusOnFirstError(tabsCtx),
  });
<\/script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
`,m=`<script lang="ts">
  import {
    BasicForm,
    createForm,
    getValueSnapshot,
    type UiSchemaRoot,
  } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/compat";

  import * as defaults from "$lib/sjsf/defaults";
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
    resolver,
    schema,
    uiSchema,
    onSubmit: console.log,
    onSubmitError: createTabbedFocusOnFirstError(tabsCtx),
  });
<\/script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
`,h=e({default:()=>_,meta:()=>g}),g=t({category:r.UiExtension,title:`Tabbed Layout`,description:`Custom tabbed layout for form sections.`,tags:[i.Layout]}),_=n({files:{"src/lib/tabs/context.svelte.ts":a,"src/lib/tabs/layout.svelte":c,"src/lib/tabs/schema.ts":l,"src/lib/tabs/tabs.svelte":d,"src/lib/tabs/focus.ts":o,"src/lib/tabs/tab.svelte":u,"src/lib/tabs/index.ts":s,"src/routes/sub-tabs.svelte":p,"src/routes/+page.svelte":f,"src/routes/top-tabs.svelte":m},fields:[`enum`]});export{h as n,g as t};