const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/svelte-lab.DNrwfHuQ.js","_astro/rolldown-runtime.DAXXjFlN.js","_astro/lz-string.DfFT4Ax2.js","_astro/local.BmQxmZ_-.js","_astro/button.BY3pompS.js","_astro/index-client.DygggIMv.js","_astro/preload-helper.cnMfez3d.js","_astro/client.B0k3dZbu.js","_astro/codegen.B8cMxfJr.js","_astro/acorn-typescript.5y6L5Nxu.js","_astro/schema-to-zod.DCyekANx.js","_astro/schema-transform.BNDWTQ3M.js","_astro/schema-to-valibot.BVSXxt4g.js","_astro/dist.BZD8YfXO.js","_astro/schema-to-standard-schema.CIFNjN1t.js"])))=>i.map(i=>d[i]);
import{r as e}from"./rolldown-runtime.DAXXjFlN.js";import{t}from"./preload-helper.cnMfez3d.js";import{ct as n}from"./index-client.DygggIMv.js";import{a as r,c as i,i as a,n as o,r as s,t as c}from"./model.c1mY7gwZ.js";import{n as l}from"./button.BY3pompS.js";import{t as u}from"./server.VN4yoodA.js";import{t as d}from"./post.BuMwh1ST.js";import{n as f,t as p}from"./unknown-date-field.CSs7MRjk.js";var m;(function(e){e.StackBlitz=`StackBlitz`,e.SvelteLab=`SvelteLab`,e.Local=`Local`})(m||={});var ee=Object.values(m),te=`src/routes/+page.svelte`;function ne(e){switch(e){case m.Local:return`Download project`;default:return`Open in ${e}`}}var re={[m.StackBlitz]:()=>t(()=>import(`./stackblitz.DyrVFvZ9.js`),[]),[m.SvelteLab]:()=>t(()=>import(`./svelte-lab.DNrwfHuQ.js`),__vite__mapDeps([0,1,2])),[m.Local]:()=>t(()=>import(`./local.BmQxmZ_-.js`),__vite__mapDeps([3,4,5,6,7,8,1,9]))};async function h(e){(await re[e.platform]()).default(e)}async function ie({name:e,themeOrSubTheme:t,validator:n,icons:r,extraFiles:i,extraDependencies:a,fields:o,widgets:s,platform:u}){await h({name:e,platform:u,files:await l({...c,name:e,icons:r,themeOrSubTheme:t,validator:n,extraFiles:i,extraDependencies:a,fields:o,widgets:s})})}var ae=`<script lang="ts">
  import {
    createFormValidator,
    DEFAULT_AJV_CONFIG,
    addFormComponents,
  } from "@sjsf/ajv8-validator";
  import { createForm, BasicForm, type Schema } from "@sjsf/form";
  import addFormats from "ajv-formats";
  import localize from "ajv-i18n/localize/ru";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = {
    type: "object",
    title: "User form",
    properties: {
      name: { title: "Name", type: "string", minLength: 1 },
      email: { title: "Email", type: "string", format: "email" },
      age: { title: "Age", type: "integer", minimum: 18, maximum: 35 },
    },
    required: ["name", "email", "age"],
  } as const satisfies Schema;

  const form = createForm({
    ...defaults,
    validator: createFormValidator({
      ajvOptions: { ...DEFAULT_AJV_CONFIG, messages: false },
      ajvPlugins: (ajv) => addFormats(addFormComponents(ajv)),
      localize: (errors) => {
        localize(errors);
        return errors;
      },
    }),
    schema,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} novalidate />
`,oe=e({default:()=>se,meta:()=>g}),g=r({category:o.LogicExtension,title:`AJV i18n`,description:`AJV validation with localized error messages using ajv-i18n.`,tags:[s.Schema],isValidatorSpecific:!0}),se=a({validator:`ajv8`,dependencies:[n(`ajvFormat`),n(`ajvI18n`)],files:{"src/routes/+page.svelte":ae}}),ce=`<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from "@sjsf/form/validators/standard-schema";
  import { type } from "arktype";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = type({
    hello: "string",
  });

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    uiSchema: {
      "ui:options": {
        title: "Basic form",
      },
      hello: {
        "ui:options": {
          title: "Hello",
        },
      },
    },
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} novalidate />
`,le=e({default:()=>ue,meta:()=>_}),_=r({category:o.Starters,title:`Arktype Starter`,description:`Arktype with standard-schema validator starter.`,tags:[],isValidatorSpecific:!0}),ue=a({validator:`noop`,dependencies:[n(`arktype`)],files:{"src/routes/+page.svelte":ce}}),de=`<script lang="ts">
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchemaRoot,
  } from "@sjsf/form";
  import { identity } from "@sjsf/form/lib/function";

  import { browser } from "$app/environment";
  import * as defaults from "$lib/sjsf/defaults";

  import AsyncComboboxWidget, {
    type MyAsyncComboboxOptions,
  } from "./async-combobox-widget.svelte";
  import { COUNTRIES } from "./countries";

  async function searchFn(_: AbortSignal, query: string) {
    await new Promise((r) => setTimeout(r, 1000));
    return COUNTRIES.filter((c) =>
      c.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    );
  }

  const schema = {
    type: "string",
    title: "Country",
  } as const satisfies Schema;

  const uiSchema: UiSchemaRoot = {
    "ui:components": {
      textWidget: AsyncComboboxWidget,
    },
    "ui:options": {
      myAsyncComboboxOptions: {
        searchFn,
        getId: identity,
        getLabel: identity,
      } satisfies MyAsyncComboboxOptions<string>,
      translations: {
        get submit(): string {
          return form.submission.isProcessed ? "Validation..." : "Submit";
        },
      },
    },
  };

  const form = createForm({
    ...defaults,
    validator: (options) => {
      const defaultValidator = defaults.validator<string>(options);
      return {
        ...defaultValidator,
        async validateFormValueAsync(signal, rootSchema, formValue) {
          const result = defaultValidator.validateFormValue(
            rootSchema,
            formValue
          );
          if (result.errors) {
            return result;
          }
          if (typeof formValue === "string") {
            const countries = await searchFn(signal, formValue);
            if (countries.includes(formValue)) {
              return {
                value: formValue,
              };
            }
          }
          return {
            value: formValue,
            errors: [
              {
                path: [],
                message: "invalid country",
              },
            ],
          };
        },
      };
    },
    // NOTE: the behavior of the \`$derived\` rune during SSR is different from the browser
    get disabled(): boolean {
      return browser && form.submission.isProcessed;
    },
    schema,
    uiSchema,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
`,fe=`<script lang="ts" module>
  import type { SchemaValue } from "@sjsf/form";

  import type { Props } from "./async-combobox.svelte";

  export interface MyAsyncComboboxOptions<
    T extends SchemaValue,
  > extends Props<T> {}

  declare module "@sjsf/form" {
    interface UiOptions {
      myAsyncComboboxOptions?: MyAsyncComboboxOptions<any>;
    }
  }
<\/script>

<script lang="ts">
  import { composeProps, disabledProp, getFormContext } from "@sjsf/form";
  import type { WidgetCommonProps } from "@sjsf/form/fields/widgets";

  import AsyncCombobox from "./async-combobox.svelte";

  let {
    uiOption,
    value = $bindable(),
    config,
  }: WidgetCommonProps<SchemaValue> = $props();

  const ctx = getFormContext();
  const comboboxOptions = $derived(uiOption("myAsyncComboboxOptions"));
<\/script>

{#if comboboxOptions}
  <AsyncCombobox
    {...composeProps(ctx, config, { ...comboboxOptions }, disabledProp)}
    bind:value
  />
{:else}
  <p>Combobox options are undefined</p>
{/if}
`,pe=`<!--
  For the most part the component is Claude-generated,
  this example isn't about creating an async-combobox component,
  it's about using one
-->

<script lang="ts" module>
  export interface Props<T> {
    searchFn: (signal: AbortSignal, query: string) => Promise<T[]>;
    placeholder?: string;
    value?: T;
    onSelect?: (item: T | undefined) => void;
    getId: (item: T) => PropertyKey;
    getLabel: (item: T) => string;
    minQueryLength?: number;
    debounceMs?: number;
    timeoutMs?: number;
    maxResults?: number;
    disabled?: boolean;
  }
<\/script>

<script lang="ts" generics="T">
  import {
    abortPrevious,
    createTask,
    debounce,
    type Task,
  } from "@sjsf/form/lib/task.svelte";
  import { untrack } from "svelte";

  let {
    searchFn,
    placeholder = "Search...",
    value = $bindable(),
    onSelect,
    getId,
    getLabel,
    minQueryLength = 2,
    debounceMs = 300,
    timeoutMs = 8000,
    maxResults = 50,
    disabled,
  }: Props<T> = $props();

  let query = $state("");
  let isOpen = $state(false);
  let highlightedIndex = $state(-1);
  let inputElement: HTMLInputElement;
  let listElement: HTMLUListElement;

  // Create the search action with throttling
  const searchAction: Task<[string], T[], Error> = createTask({
    execute: debounce(
      async (signal: AbortSignal, searchQuery: string) => {
        if (searchQuery.length < minQueryLength) {
          return [];
        }
        const r = await searchFn(signal, searchQuery);
        return r.slice(0, maxResults);
      },
      () => debounceMs
    ),
    combinator: abortPrevious,
    delayedMs: 150,
    get timeoutMs() {
      return timeoutMs;
    },
    onSuccess(results) {
      items = results;
      isOpen = results.length > 0;
      highlightedIndex = results.length > 0 ? 0 : -1;
    },
    onFailure(failure) {
      if (failure.reason !== "aborted") {
        console.error("Search failed:", failure);
        items = [];
        isOpen = false;
      }
    },
  });

  let items = $state<T[]>([]);

  // Reactive search trigger
  $effect(() => {
    const trimmed = query.trim();
    if (trimmed.length >= minQueryLength) {
      untrack(() => {
        if (value !== undefined && trimmed === getLabel(value)) {
          return;
        }
        searchAction.run(trimmed);
      });
    } else {
      untrack(() => searchAction.abort());
      items = [];
      isOpen = false;
    }
  });

  // Update query when value changes externally
  // $effect(() => {
  //   if (value !== undefined) {
  //     query = getLabel(value);
  //   } else if (!isOpen) {
  //     query = "";
  //   }
  // });

  function selectItem(item: T | undefined) {
    value = item;
    query = item !== undefined ? getLabel(item) : "";
    isOpen = false;
    highlightedIndex = -1;
    onSelect?.(item);
    if (item !== undefined) {
      inputElement?.blur();
    }
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    query = target.value;

    if (!query.trim()) {
      selectItem(undefined);
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen && query.trim()) {
          isOpen = true;
          highlightedIndex = 0;
        } else if (isOpen && highlightedIndex < items.length - 1) {
          highlightedIndex++;
          scrollToHighlighted();
        }
        break;

      case "ArrowUp":
        event.preventDefault();
        if (isOpen && highlightedIndex > 0) {
          highlightedIndex--;
          scrollToHighlighted();
        }
        break;

      case "Enter":
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0 && items[highlightedIndex]) {
          selectItem(items[highlightedIndex]);
        }
        break;

      case "Escape":
        event.preventDefault();
        isOpen = false;
        highlightedIndex = -1;
        inputElement?.blur();
        break;

      case "Tab":
        if (isOpen) {
          isOpen = false;
          highlightedIndex = -1;
        }
        break;
    }
  }

  function handleFocus() {
    if (query.trim() && items.length > 0) {
      isOpen = true;
      highlightedIndex = highlightedIndex >= 0 ? highlightedIndex : 0;
    }
  }

  function handleBlur(event: FocusEvent) {
    // Delay closing to allow clicking on items
    setTimeout(() => {
      if (!listElement?.contains(document.activeElement)) {
        isOpen = false;
        highlightedIndex = -1;
      }
    }, 150);
  }

  function handleItemClick(item: T | undefined) {
    selectItem(item);
  }

  function handleItemMouseEnter(index: number) {
    highlightedIndex = index;
  }

  function scrollToHighlighted() {
    if (highlightedIndex >= 0 && listElement) {
      const item = listElement.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: "nearest" });
      }
    }
  }

  // Clear search when component unmounts
  $effect(() => {
    return () => {
      searchAction.abort();
    };
  });
<\/script>

<div class="combobox-container">
  <div class="combobox-input-wrapper">
    <input
      {disabled}
      bind:this={inputElement}
      bind:value={query}
      type="text"
      class="combobox-input"
      class:loading={searchAction.isDelayed}
      {placeholder}
      autocomplete="off"
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-autocomplete="list"
      aria-activedescendant={highlightedIndex >= 0
        ? \`option-\${highlightedIndex}\`
        : undefined}
      oninput={handleInput}
      onkeydown={handleKeydown}
      onfocus={handleFocus}
      onblur={handleBlur}
    />

    {#if searchAction.isProcessed && searchAction.isDelayed}
      <div class="loading-spinner" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-dasharray="31.416"
            stroke-dashoffset="31.416"
          >
            <animate
              attributeName="stroke-dasharray"
              dur="2s"
              values="0 31.416;15.708 15.708;0 31.416"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dashoffset"
              dur="2s"
              values="0;-15.708;-31.416"
              repeatCount="indefinite"
            />
          </circle></svg
        >
      </div>
    {/if}

    {#if value && !searchAction.isProcessed}
      <button
        type="button"
        class="clear-button"
        aria-label="Clear selection"
        onclick={() => selectItem(undefined)}
      >
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path
            stroke="currentColor"
            stroke-width="2"
            d="M18 6L6 18M6 6l12 12"
          />
        </svg>
      </button>
    {/if}
  </div>

  {#if isOpen && items.length > 0}
    <ul
      bind:this={listElement}
      class="combobox-list"
      role="listbox"
      aria-label="Search results"
    >
      {#each items as item, index (getId(item))}
        <li
          id="option-{index}"
          class="combobox-item"
          class:highlighted={index === highlightedIndex}
          role="option"
          aria-selected={index === highlightedIndex}
          tabindex="-1"
          onclick={() => handleItemClick(item)}
          onmouseenter={() => handleItemMouseEnter(index)}
        >
          <span class="item-label">{getLabel(item)}</span>
        </li>
      {/each}
    </ul>
  {/if}

  {#if searchAction.matches("failed")}
    {#if searchAction.state.reason === "timeout"}
      <div class="error-message" role="alert">
        Search timed out. Please try again.
      </div>
    {/if}

    {#if searchAction.state.reason === "error"}
      <div class="error-message" role="alert">
        Search failed. Please try again.
      </div>
    {/if}
  {/if}
</div>

<style>
  .combobox-container {
    position: relative;
    width: 100%;
  }

  .combobox-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .combobox-input {
    width: 100%;
    padding: 8px 32px 8px 12px;
    font-size: 14px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
    transition:
      border-color 0.15s ease-in-out,
      box-shadow 0.15s ease-in-out;
  }

  .combobox-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .combobox-input.loading {
    padding-right: 40px;
  }

  .loading-spinner {
    position: absolute;
    right: 12px;
    color: #6b7280;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .clear-button {
    position: absolute;
    right: 8px;
    padding: 4px;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    border-radius: 4px;
    transition: color 0.15s ease-in-out;
  }

  .clear-button:hover {
    color: #374151;
  }

  .combobox-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    max-height: 200px;
    overflow-y: auto;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    margin-top: 2px;
    padding: 0;
    list-style: none;
  }

  .combobox-item {
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
    border-bottom: 1px solid #f3f4f6;
  }

  .combobox-item:last-child {
    border-bottom: none;
  }

  .combobox-item:hover,
  .combobox-item.highlighted {
    background-color: #f3f4f6;
  }

  .combobox-item.highlighted {
    background-color: #dbeafe;
  }

  .item-label {
    display: block;
    font-size: 14px;
    color: #111827;
  }

  .error-message {
    margin-top: 4px;
    padding: 6px 8px;
    font-size: 12px;
    color: #dc2626;
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 4px;
  }
</style>
`,me=`export const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Brazzaville)",
  "Congo (Kinshasa)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea (North)",
  "Korea (South)",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];
`,he=e({default:()=>ge,meta:()=>v}),v=r({category:o.LogicExtension,title:`Async Combobox`,description:`Custom async combobox widget with search functionality.`,tags:[s.CustomComponent,s.Enum]}),ge=a({files:{"src/routes/countries.ts":me,"src/routes/+page.svelte":de,"src/routes/async-combobox.svelte":pe,"src/routes/async-combobox-widget.svelte":fe}}),_e=`<script lang="ts">
  import {
    type Schema,
    createForm,
    Field,
    getFieldErrors,
    getFormContext,
    getValueSnapshot,
    makeEventHandlers,
    validateField,
  } from "@sjsf/form";
  import { getTemplateProps } from "@sjsf/form/templates/get-template-props";
  import type { FromSchema } from "json-schema-to-ts";

  import * as defaults from "$lib/sjsf/defaults";

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
    additionalProperties: false,
  } as const satisfies Schema;

  const form = createForm<FromSchema<typeof schema>>({
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
  <code>{JSON.stringify(getValueSnapshot(form), null, 2)}</code>
</pre>
`,ve=e({default:()=>ye,meta:()=>y}),y=r({category:o.UiExtension,title:`Decomposed Field`,description:`Complex field decomposed into reusable sub-components.`,tags:[s.CustomComponent]}),ye=a({files:{"src/routes/+page.svelte":_e}}),be=`<script lang="ts" module>
  declare module "@sjsf/form" {
    interface Schema {
      deprecated?: boolean;
    }
  }
<\/script>

<script lang="ts">
  import { createForm, BasicForm, type Schema, type Config } from "@sjsf/form";
  import { fromFactories } from "@sjsf/form/lib/resolver";
  import type { HTMLAttributes } from "svelte/elements";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = {
    type: "object",
    title: "Basic form",
    properties: {
      foo: {
        type: "string",
      },
      bar: {
        type: "string",
        deprecated: true,
      },
    },
    required: ["hello"],
  } as const satisfies Schema;

  const form = createForm({
    ...defaults,
    schema,
    extraUiOptions: fromFactories({
      layouts: (config: Config) => ({
        "object-property": config.schema.deprecated
          ? ({
              style:
                "padding: 0.5rem; border: solid 1px orange; border-radius: 5px;",
            } satisfies HTMLAttributes<HTMLDivElement>)
          : undefined,
      }),
      action: (config: Config) =>
        config.schema.deprecated ? deprecated : undefined,
    }),
    onSubmit: console.log,
  });
<\/script>

{#snippet deprecated()}
  <span>(deprecated)</span>
{/snippet}

<BasicForm {form} />
`,xe=e({default:()=>Se,meta:()=>b}),b=r({category:o.LogicExtension,title:`Deprecated Keyword`,description:`Adding support for new JSON Schema keywords like 'deprecated'.`,tags:[s.Schema]}),Se=a({files:{"src/routes/+page.svelte":be}}),Ce=`<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { convert } from "@sjsf/form/converters/draft-2020-12";
  import type { JSONSchema } from "json-schema-typed/draft-2020-12";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "array",
    prefixItems: [
      { title: "foo", type: "string", default: "carp" },
      { title: "bar", type: "string", minLength: 3 },
    ],
    items: { title: "Additional", type: "number" },
  } as const satisfies JSONSchema;

  const form = createForm({
    ...defaults,
    // WARN: Some validation functionality is lost during schema conversion.
    // Keep this in mind on the client side and use the original schema for server-side validation.
    schema: convert(schema),
    // Example using \`Ajv2020\`:
    // validator: <T,>(options: ValidatorFactoryOptions) => {
    //   const validator = defaults.validator<T>({
    //     ...options,
    //     Ajv: Ajv2020,
    //   });
    //   // TODO: Pass the original schema parts to the \`isValid\` method.
    //   return {
    //     ...validator,
    //     validateFormValue(_, formValue) {
    //       return validator.validateFormValue(schema, formValue);
    //     },
    //   };
    // },
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
`,we=e({default:()=>Te,meta:()=>x}),x=r({category:o.LogicExtension,title:`Draft 2020-12`,description:`JSON Schema draft 2020-12 features including $ref.`,tags:[s.Schema]}),Te=a({dependencies:[n(`jsonSchemaTyped`)],files:{"src/routes/+page.svelte":Ce}}),Ee=`<script lang="ts" module>
  import type { Options, WidgetCommonProps } from "@sjsf/form/fields/widgets";

  declare module "@sjsf/form" {
    interface ComponentProps {
      myDynamicEnumWidget: WidgetCommonProps<SchemaValue> & Options;
    }
    interface ComponentBindings {
      myDynamicEnumWidget: "value";
    }
  }
<\/script>

<script lang="ts">
  import {
    createForm,
    BasicForm,
    type Schema,
    type SchemaValue,
    type Config,
    type UiSchema,
    getValueSnapshot,
  } from "@sjsf/form";
  import { chain, fromRecord, fromFactories } from "@sjsf/form/lib/resolver";
  import "@sjsf/form/fields/extra/enum-include";

  import * as defaults from "$lib/sjsf/defaults";

  import RadioWithOther, { OTHER_VALUE } from "./radio-with-other.svelte";

  const schema = {
    type: "object",
    title: "Enums form",
    properties: {
      shortEnum: {
        enum: ["foo", "bar", "baz"],
      },
      longEnum: {
        enum: ["foo", "bar", "baz", "one", "two", "three"],
      },
      withOther: {
        type: "string",
      },
    },
  } as const satisfies Schema;

  const uiSchema: UiSchema = {
    shortEnum: {
      "ui:components": {
        stringField: "enumField",
        selectWidget: "myDynamicEnumWidget",
      },
    },
    longEnum: {
      "ui:components": {
        stringField: "enumField",
        selectWidget: "myDynamicEnumWidget",
      },
    },
    withOther: {
      "ui:components": {
        textWidget: "myRadioWithOtherWidget",
      },
      "ui:options": {
        myEnumValues: ["foo", "bar", "baz", OTHER_VALUE],
        stringEmptyValue: "",
        useLabel: false,
      },
    },
  };

  const extraUiOptions = fromFactories({
    useLabel: (config: Config) => {
      const enumValues =
        config.uiSchema["ui:components"]?.selectWidget ===
          "myDynamicEnumWidget" && config.schema.enum;
      return enumValues ? (enumValues.length > 4 ? true : false) : undefined;
    },
  });

  const withRadioWithOtherWidget = chain(
    defaults.theme,
    fromRecord({
      myRadioWithOtherWidget: RadioWithOther,
    })
  );

  const withDynamicEnumWidget = chain(
    withRadioWithOtherWidget,
    fromFactories({
      myDynamicEnumWidget: (config: Config) => {
        const enumValues = config.schema.enum;
        // NOTE The \`theme\` call is used so that the example works with all themes.
        // You can return the desired component directly.
        return withRadioWithOtherWidget(
          enumValues && enumValues.length > 4
            ? "selectWidget"
            : "myRadioWithOtherWidget",
          config
        );
      },
    })
  );

  const form = createForm({
    ...defaults,
    theme: withDynamicEnumWidget,
    schema,
    uiSchema,
    extraUiOptions,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />

<pre><code>{JSON.stringify(getValueSnapshot(form), null, 2)}</code></pre>
`,De=`<script lang="ts" module>
  import type { Schema, SchemaValue } from "@sjsf/form";
  import type { WidgetCommonProps } from "@sjsf/form/fields/widgets";
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface ComponentProps {
      myRadioWithOtherWidget: WidgetCommonProps<SchemaValue>;
    }
    interface ComponentBindings {
      myRadioWithOtherWidget: "value";
    }
    interface UiOptions {
      myEnumValues?: Schema["enum"];
      myRadioWithOther?: HTMLInputAttributes;
      myRadioWithOtherText?: HTMLInputAttributes;
    }
    interface IdentifiableFieldElement {
      other: {};
    }
  }

  export const OTHER_VALUE = "other";
<\/script>

<script lang="ts">
  import {
    type ComponentProps,
    getPseudoId,
    getFormContext,
    inputAttributes,
    uiOptionProps,
    composeProps,
    handlersAttachment,
  } from "@sjsf/form";
  import { createFormOptions } from "@sjsf/form/fields/enum";
  import { EMPTY_VALUE } from "@sjsf/form/options.svelte";

  let {
    value = $bindable(),
    config,
    uiOption,
    handlers,
  }: ComponentProps["myRadioWithOtherWidget"] = $props();

  const ctx = getFormContext();

  const values = $derived(uiOption("myEnumValues"));

  const attributes = $derived(
    inputAttributes(ctx, config, "myRadioWithOther", handlers, {
      type: "radio",
    })
  );

  const { options, mapper } = $derived(
    createFormOptions(ctx, config, uiOption, {
      ...config.schema,
      enum: config.schema.enum ?? values,
    }) ?? []
  );
  const mappedValue = $derived(mapper.fromValue(value));
  const mappedOther = $derived(mapper.fromValue(OTHER_VALUE));
  const isOther = $derived(
    typeof value === "string" &&
      (value === OTHER_VALUE || mappedValue === EMPTY_VALUE)
  );
  const mapped = {
    get current() {
      return isOther ? mappedOther : mappedValue;
    },
    set current(v) {
      value = v === mappedOther ? "" : mapper.toValue(v);
    },
  };
<\/script>

{#each options as option (option.id)}
  <label>
    <input
      bind:group={mapped.current}
      value={option.mappedValue ?? option.id}
      {...attributes}
      id={option.id}
      disabled={option.disabled || attributes.disabled}
    />
    {option.label}
  </label>
{/each}

{#if isOther}
  <input
    {...composeProps(
      ctx,
      config,
      { type: "text", id: getPseudoId(ctx, config.path, "other") },
      uiOptionProps("myRadioWithOtherText"),
      handlersAttachment(handlers)
    )}
    bind:value
  />
{/if}
`,Oe=e({default:()=>ke,meta:()=>S}),S=r({category:o.UiExtension,title:`Enum Widgets`,description:`Different widget types for enum properties.`,tags:[s.Enum,s.CustomComponent]}),ke=a({files:{"src/routes/+page.svelte":Ee,"src/routes/radio-with-other.svelte":De}}),Ae=`import { loadResults } from "$lib/server";

import type { LayoutServerLoad } from "./$types";

export const trailingSlash = "always";

export const load: LayoutServerLoad = async () => {
  return {
    results: await loadResults(),
  };
};
`,C=`<script lang="ts">
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
<\/script>

<div class="center">
  <a href="./foo">Foo form</a>
  <a href="./bar">Bar form</a>
  <p>Results:</p>
  <pre><code>{JSON.stringify(data.results, null, 2)}</code></pre>
</div>

<style>
  .center {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
</style>
`,je=`import type { InitialFormData } from "@sjsf/sveltekit";
import { createFormHandler } from "@sjsf/sveltekit/server";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";

import { loadSchemaById, saveResult } from "$lib/server";
import * as defaults from "$lib/sjsf/defaults";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const schema = await loadSchemaById(params.id);
  if (schema === undefined) {
    error(404);
  }
  return {
    form: {
      schema,
    } satisfies InitialFormData<unknown>,
  };
};

export const actions = {
  default: async ({ request, params }) => {
    const schema = params.id && (await loadSchemaById(params.id));
    if (!schema) {
      error(404);
    }
    const [form] = await createFormHandler({
      ...defaults,
      schema,
      sendData: true,
    })(request.signal, await request.formData());
    if (!form.isValid) {
      return fail(400, { form });
    }
    await saveResult(form.data);
    redirect(303, "..");
  },
} satisfies Actions;
`,Me=`<script lang="ts">
  import { createMeta, SvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/sjsf/defaults";

  import type { ActionData, PageData } from "./$types";

  const meta = createMeta<ActionData, PageData>().form;
<\/script>

<SvelteKitForm
  {...defaults}
  {meta}
  uiSchema={{
    "ui:options": {
      form: {
        novalidate: true,
      },
    },
  }}
/>
`,Ne=e({default:()=>Pe,meta:()=>w}),w=r({category:o.SvelteKitIntegrations,title:`Form Actions Dynamic Schema`,description:`Dynamic schemas combined with SvelteKit form actions.`,tags:[s.FormActions]}),Pe=a({sveltekit:`formActions`,files:{"src/lib/server.ts":u,"src/routes/+layout.server.ts":Ae,"src/routes/+page.svelte":C,"src/routes/[id]/+page.server.ts":je,"src/routes/[id]/+page.svelte":Me}}),Fe=`import type { InitialFormData } from "@sjsf/sveltekit";
import { createFormHandler } from "@sjsf/sveltekit/server";
import { fail, type Actions } from "@sveltejs/kit";

import { type CreatePost, schema } from "$lib/post";
import * as defaults from "$lib/sjsf/defaults";

export const load = async () => {
  return {
    // Should match action name
    form: {
      schema,
      initialValue: { title: "New post", content: "" },
    } satisfies InitialFormData<CreatePost>,
  };
};

const handleForm = createFormHandler<CreatePost, true>({
  ...defaults,
  schema,
  sendData: true,
});

export const actions = {
  default: async ({ request }) => {
    const [form, , invalid] = await handleForm(
      request.signal,
      await request.formData()
    );
    if (!form.isValid) {
      return fail(400, { form });
    }
    const { title, content } = form.data;
    if (title.length > 100) {
      return fail(400, {
        form: invalid([{ path: ["title"], message: "Title is too long" }]),
      });
    }
    // Your logic here
    return { form, post: { id: "new-post", title, content } };
  },
} satisfies Actions;
`,Ie=`<script lang="ts">
  import { BasicForm } from "@sjsf/form";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/sjsf/defaults";

  import type { ActionData, PageData } from "./$types";

  const meta = createMeta<ActionData, PageData>().form;
  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    onSuccess: (result) => {
      if (result.type === "success") {
        console.log(result.data?.post);
      }
    },
  });
<\/script>

<BasicForm {form} method="POST" />
`,Le=e({default:()=>Re,meta:()=>T}),T=r({category:o.SvelteKitIntegrations,title:`Form Actions Flex`,description:`Flexible form actions for different submission patterns.`,tags:[s.FormActions]}),Re=a({sveltekit:`formActions`,files:{"src/lib/post.ts":d,"src/routes/+page.server.ts":Fe,"src/routes/+page.svelte":Ie}}),ze=`import type { Schema } from "@sjsf/form";
import type { InitialFormData } from "@sjsf/sveltekit";
import { createAction } from "@sjsf/sveltekit/server";

import * as defaults from "$lib/sjsf/defaults";

import type { Actions } from "./$types";

const schema: Schema = {
  title: "Registration form",
  type: "object",
  properties: {
    firstName: {
      type: "string",
      title: "First name",
    },
    lastName: {
      type: "string",
      title: "Last name",
    },
    age: {
      type: "number",
      title: "Age",
      minimum: 21,
    },
  },
  required: ["firstName", "lastName", "age"],
};

interface CreateUser {
  firstName: string;
  lastName: string;
  age: number;
}

export const load = async () => {
  return { form: { schema } satisfies InitialFormData<CreateUser> };
};

export const actions = {
  default: createAction(
    {
      ...defaults,
      name: "form",
      schema,
      sendData: true,
    },
    (data: CreateUser) => {
      console.log(data);
    }
  ),
} satisfies Actions;
`,Be=`<script lang="ts">
  import { setFormContext, Content, SubmitButton } from "@sjsf/form";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/sjsf/defaults";

  import type { ActionData, PageData } from "./$types";

  const meta = createMeta<ActionData, PageData>().form;

  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    onSubmit: console.log,
  });
  setFormContext(form);
<\/script>

<form
  novalidate
  method="POST"
  style="display: flex; flex-direction: column; gap: 1rem;"
>
  <Content />
  <SubmitButton />
</form>
`,Ve=e({default:()=>He,meta:()=>E}),E=r({category:o.SvelteKitIntegrations,title:`Form Actions Without JS`,description:`Form actions with JavaScript disabled.`,tags:[s.FormActions,s.NoJs]}),He=a({sveltekit:`formActions`,files:{"src/routes/+page.server.ts":ze,"src/routes/+page.svelte":Be}}),Ue=`import type { InitialFormData } from "@sjsf/sveltekit";
import { createAction } from "@sjsf/sveltekit/server";
import type { Actions } from "@sveltejs/kit";

import { schema, type CreatePost } from "$lib/post";
import * as defaults from "$lib/sjsf/defaults";

export const load = async () => {
  return {
    // Should match action name
    form: {
      schema,
      initialValue: { title: "New post", content: "" },
    } satisfies InitialFormData<CreatePost>,
  };
};

export const actions = {
  default: createAction(
    {
      ...defaults,
      name: "form",
      schema,
      sendData: true,
    },
    ({ title, content }: CreatePost) => {
      if (title.length > 100) {
        return [{ path: ["title"], message: "Title is too long" }];
      }
      // Your logic here
      return { post: { id: "new-post", title, content } };
    }
  ),
} satisfies Actions;
`,We=`<script lang="ts">
  import { createMeta, SvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/sjsf/defaults";

  import type { ActionData, PageData } from "./$types";

  const meta = createMeta<ActionData, PageData>().form;
<\/script>

<SvelteKitForm
  {...defaults}
  {meta}
  onSuccess={(result) => {
    if (result.type === "success") {
      console.log(result.data?.post);
    }
  }}
/>
`,Ge=e({default:()=>Ke,meta:()=>D}),D=r({category:o.SvelteKitIntegrations,title:`Form Actions`,description:`JSON Schema forms integrated with SvelteKit form actions.`,tags:[s.FormActions]}),Ke=a({sveltekit:`formActions`,files:{"src/lib/post.ts":d,"src/routes/+page.server.ts":Ue,"src/routes/+page.svelte":We}}),qe=`<script lang="ts">
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchemaRoot,
  } from "@sjsf/form";
  import type { SchemaObjectValue } from "@sjsf/form/core";
  import type { FromSchema } from "json-schema-to-ts";

  import * as defaults from "$lib/sjsf/defaults";

  import ObjectField from "./object-field.svelte";

  const schema = {
    title: "Invoice Form",
    type: "object",
    properties: {
      unitPrice: {
        type: "number",
        title: "Unit Price",
        minimum: 0,
      },
      quantity: {
        type: "integer",
        title: "Quantity",
        minimum: 0,
      },
      taxRate: {
        type: "number",
        title: "Tax Rate (%)",
        minimum: 0,
        maximum: 100,
        default: 20,
      },
      subtotal: {
        type: "number",
        title: "Subtotal",
      },
      taxAmount: {
        type: "number",
        title: "Tax Amount",
      },
      total: {
        type: "number",
        title: "Total",
      },
    },
    required: ["unitPrice", "quantity", "taxRate"],
    additionalProperties: false,
  } as const satisfies Schema;

  type Value = FromSchema<typeof schema>;

  function formula(
    property: keyof Value,
    calculate: (v: Required<Value>) => number
  ) {
    return (value: SchemaObjectValue | null | undefined) => {
      if (!value) {
        return;
      }
      let ignore = false;
      const proxy = new Proxy(value, {
        get(target, p) {
          const v = target[p as string];
          if (typeof v === "number") {
            return v;
          }
          ignore = true;
          return 0;
        },
      }) as Record<keyof Value, number>;
      const result = calculate(proxy);
      if (!ignore) {
        value[property] = result;
      }
    };
  }

  const uiSchema: UiSchemaRoot = {
    "ui:components": {
      objectField: ObjectField,
    },
    "ui:options": {
      myObjectEffects: [
        formula("subtotal", (o) => o.unitPrice * o.quantity),
        formula("taxAmount", (o) => (o.subtotal * o.taxRate) / 100),
        formula("total", (o) => o.subtotal + o.taxAmount),
      ],
    },
  };

  const form = createForm({
    ...defaults,
    schema,
    uiSchema,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
`,Je=`<script lang="ts" module>
  import type { SchemaObjectValue } from "@sjsf/form/core";

  declare module "@sjsf/form" {
    interface UiOptions {
      myObjectEffects?: ((
        value: SchemaObjectValue | null | undefined
      ) => void | (() => void))[];
    }
  }
<\/script>

<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";
  import Field from "@sjsf/form/fields/object/object-field.svelte";

  let {
    value = $bindable(),
    uiOption,
    ...rest
  }: ComponentProps["objectField"] = $props();

  const effects = $derived(uiOption("myObjectEffects"));

  $effect(() => {
    if (!effects) {
      return;
    }
    for (const fn of effects) {
      $effect(() => fn(value));
    }
  });
<\/script>

<Field bind:value {uiOption} {...rest} />
`,Ye=e({default:()=>Xe,meta:()=>O}),O=r({category:o.LogicExtension,title:`Formulas`,description:`Custom field component with its own logic (formula-based values).`,tags:[s.CustomComponent]}),Xe=a({files:{"src/routes/+page.svelte":qe,"src/routes/object-field.svelte":Je}}),Ze=`<script lang="ts">
  import { createForm, BasicForm, type Schema, type Config } from "@sjsf/form";
  import { fromFactories } from "@sjsf/form/lib/resolver";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = {
    title: "A registration form",
    description: "A simple form example.",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      firstName: {
        type: "string",
        title: "First name",
        default: "Chuck",
      },
      lastName: {
        type: "string",
        title: "Last name",
      },
      age: {
        type: "integer",
        title: "Age",
      },
      bio: {
        type: "string",
        title: "Bio",
      },
      password: {
        type: "string",
        title: "Password",
        minLength: 3,
      },
      telephone: {
        type: "string",
        title: "Telephone",
        minLength: 10,
      },
    },
  } as const satisfies Schema;

  const displayContents = {
    style: "display: contents",
  };

  const form = createForm({
    ...defaults,
    schema,
    onSubmit: console.log,
    extraUiOptions: fromFactories({
      layouts: (config: Config) =>
        config.path.length === 0
          ? {
              "object-properties": {
                class: "label-on-left",
              },
            }
          : {
              "object-property": displayContents,
              "object-property-content": displayContents,
              field: displayContents,
            },
      errorsList: (config: Config) =>
        config.path.length > 0
          ? {
              style: "grid-column: 2 / -1",
            }
          : undefined,
    }),
  });
<\/script>

<BasicForm {form} novalidate />

<style>
  :global(.label-on-left) {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    align-items: center;
  }
</style>
`,Qe=e({default:()=>$e,meta:()=>k}),k=r({category:o.UiExtension,title:`Label on Left`,description:`Field labels rendered on the left side.`,tags:[s.Layout]}),$e=a({files:{"src/routes/+page.svelte":Ze}}),et=`<script lang="ts">
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchemaRoot,
    type Config,
  } from "@sjsf/form";
  import { overrideByRecord } from "@sjsf/form/lib/resolver";

  import * as defaults from "$lib/sjsf/defaults";

  import Layout from "./layout.svelte";

  const schema = {
    type: "object",
    title: "Basic form",
    properties: {
      hello: {
        title: "Hello",
        type: "string",
      },
    },
    required: ["hello"],
  } as const satisfies Schema;

  const uiSchema: UiSchemaRoot = {
    "ui:options": {
      myLayoutSlots: {
        "object-field-meta": {
          afterLayout: greeting,
        },
      },
    },
  };

  const form = createForm({
    ...defaults,
    theme: overrideByRecord(defaults.theme, { layout: Layout }),
    schema,
    uiSchema,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
{#snippet greeting(_: Config)}
  <p>
    Hi, in this example you can see how you can add text and any other content
    to a form.
  </p>
  <p>
    Of course you can use \`nullField\` to create text fields, but this changes
    the data model, which may not be acceptable in some situations.
  </p>
{/snippet}

<style>
  p {
    margin: 0;
  }
</style>
`,tt=`<script lang="ts" module>
  import { getFormContext, uiOptionNestedProps, type Config } from "@sjsf/form";
  import type { LayoutType } from "@sjsf/form/fields/components";
  import type { Snippet } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      myLayoutSlots?: {
        [L in LayoutType]?: Partial<{
          beforeLayout: Snippet<[Config]>;
          afterLayout: Snippet<[Config]>;
          beforeContent: Snippet<[Config]>;
          afterContent: Snippet<[Config]>;
        }>;
      };
    }
  }
<\/script>

<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  import { theme } from "$lib/sjsf/defaults";

  const { children, config, errors, type }: ComponentProps["layout"] = $props();

  const ctx = getFormContext();

  const OriginalLayout = $derived(theme("layout", config));

  const { afterContent, afterLayout, beforeContent, beforeLayout } = $derived(
    uiOptionNestedProps("myLayoutSlots", (data) => data[type])({}, config, ctx)
  );
<\/script>

{@render beforeLayout?.(config)}
<OriginalLayout {config} {errors} {type}>
  {@render beforeContent?.(config)}
  {@render children()}
  {@render afterContent?.(config)}
</OriginalLayout>
{@render afterLayout?.(config)}
`,nt=e({default:()=>rt,meta:()=>A}),A=r({category:o.UiExtension,title:`Layout Slots`,description:`Form layout customization using slot-based components.`,tags:[s.Layout]}),rt=a({files:{"src/routes/+page.svelte":et,"src/routes/layout.svelte":tt}}),it=`<script lang="ts">
  import { createForm, BasicForm, type Schema } from "@sjsf/form";
  import { overrideByRecord } from "@sjsf/form/lib/resolver";

  import * as defaults from "$lib/sjsf/defaults";

  import Description from "./description.svelte";

  const schema = {
    type: "null",
    title: "Title",
    description: "**bold** *italic* [link](#)",
  } as const satisfies Schema;

  const theme = overrideByRecord(defaults.theme, {
    description: Description,
  });

  const form = createForm({
    ...defaults,
    theme,
    schema,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
`,at=`<script lang="ts">
  import {
    descriptionAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";
  import Markdown from "svelte-exmarkdown";

  const { config, description }: ComponentProps["description"] = $props();

  const ctx = getFormContext();
<\/script>

<Markdown md={description}>
  {#snippet p({ children })}
    <div {...descriptionAttributes(ctx, config, "descriptionAttributes", {})}>
      {@render children?.()}
    </div>
  {/snippet}
</Markdown>
`,ot=e({default:()=>st,meta:()=>j}),j=r({category:o.UiExtension,title:`Markdown Description`,description:`Rich markdown descriptions using svelte-exmarkdown.`,tags:[s.CustomComponent]}),st=a({dependencies:[n(`svelteExmarkdown`)],files:{"src/routes/description.svelte":at,"src/routes/+page.svelte":it}}),ct=`import type { InitialFormData } from "@sjsf/sveltekit";
import { createFormHandler } from "@sjsf/sveltekit/server";
import { fail } from "@sveltejs/kit";

import * as defaults from "$lib/sjsf/defaults";

import type { Actions } from "./$types";
import { schema, STEP_KEY, stepNames, type Stepped } from "./model";

export const load = async () => {
  return {
    form: {
      schema,
      initialValue: {
        [STEP_KEY]: "first",
      },
    } satisfies InitialFormData<Stepped>,
  };
};

const handleForm = createFormHandler<Stepped, true>({
  ...defaults,
  schema,
  sendData: true,
});

export const actions = {
  default: async ({ request }) => {
    const [form] = await handleForm(request.signal, await request.formData());
    if (!form.isValid) {
      return fail(400, { form });
    }
    const index = stepNames.indexOf(form.data[STEP_KEY]);
    if (index < stepNames.length - 1) {
      form.isValid = false as true;
      form.data[STEP_KEY] = stepNames[index + 1];
    } else {
      // all steps completed
      console.log(form.data);
    }
    return {
      form,
    };
  },
} satisfies Actions;
`,lt=`<script lang="ts">
  import {
    setFormContext,
    Content,
    SubmitButton,
    type Config,
    getValueSnapshot,
  } from "@sjsf/form";
  import { isRecord } from "@sjsf/form/lib/object";
  import { fromFactories } from "@sjsf/form/lib/resolver";
  import { createMeta, setupSvelteKitForm } from "@sjsf/sveltekit/client";

  import * as defaults from "$lib/sjsf/defaults";

  import type { ActionData, PageData } from "./$types";
  import { STEP_KEY } from "./model";

  const meta = createMeta<ActionData, PageData>().form;

  const { form } = setupSvelteKitForm(meta, {
    ...defaults,
    extraUiOptions: fromFactories({
      layouts: (config: Config) =>
        config.path.length === 1
          ? {
              "object-property": {
                get style(): string {
                  // NOTE: Calling \`getValueSnapshot\` here will cause the styles
                  // to be recalculated whenever the form values change.
                  // If performance is critical for you can use controlled form
                  const snap = getValueSnapshot(form);
                  const step = isRecord(snap) && snap[STEP_KEY];
                  return \`display: \${
                    config.path[0] === step ? "block" : "none"
                  }\`;
                },
              },
            }
          : undefined,
    }),
  });
  setFormContext(form);
<\/script>

<form
  novalidate
  method="POST"
  style="display: flex; flex-direction: column; gap: 1rem;"
>
  <Content />
  <SubmitButton />
</form>
`,ut=`import type { Schema } from "@sjsf/form";

export const steps = {
  first: {
    type: "object",
    properties: {
      name: {
        type: "string",
        title: "Name",
        minLength: 1,
      },
    },
    required: ["name"],
  },
  second: {
    type: "object",
    properties: {
      email: {
        type: "string",
        title: "Email",
        format: "email",
      },
    },
    required: ["email"],
  },
} as const satisfies Record<string, Schema>;

export type StepName = keyof typeof steps;

export const STEP_KEY = "step";

export type RootKey = StepName | typeof STEP_KEY;

export interface Stepped {
  [STEP_KEY]: StepName;
}

export const stepNames = Object.keys(steps) as StepName[];

export const rootKeys = (stepNames as RootKey[]).concat(STEP_KEY);

export const schema = {
  type: "object",
  properties: {
    [STEP_KEY]: {
      type: "string",
      enum: stepNames,
    },
  },
  required: [STEP_KEY],
  dependencies: {
    step: {
      oneOf: stepNames.map((stepName, i) => {
        const required = stepNames.slice(0, i + 1);
        const entries: [RootKey, Schema][] = required.map((stepName) => [
          stepName,
          steps[stepName],
        ]);
        entries.push([STEP_KEY, { const: stepName }]);
        return {
          properties: Object.fromEntries(entries),
          required,
        };
      }),
    },
  },
} as const satisfies Schema;
`,dt=e({default:()=>ft,meta:()=>M}),M=r({category:o.SvelteKitIntegrations,title:`Multi-step Native Form`,description:`Multi-step form using native HTML form submission.`,tags:[s.FormActions]}),ft=a({sveltekit:`formActions`,files:{"src/routes/+page.server.ts":ct,"src/routes/+page.svelte":lt,"src/routes/model.ts":ut}}),pt=`<script lang="ts">
  import {
    Content,
    Form,
    createForm,
    setFormContext,
    type Schema,
    type UiSchemaRoot,
  } from "@sjsf/form";
  import { createFocusOnFirstError } from "@sjsf/form/focus-on-first-error";
  import type { Ref } from "@sjsf/form/lib/svelte.svelte";

  import * as defaults from "$lib/sjsf/defaults";

  import MultiStepField, { setStepperContext } from "./multi-step-field.svelte";

  let step = $state.raw(0);
  const stepperCtx: Ref<number> = {
    get current() {
      return step;
    },
    set current(v) {
      step = v;
    },
  };
  setStepperContext(stepperCtx);

  const schema: Schema = {
    type: "array",
    items: [
      {
        title: "Page 1",
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
        title: "Page 2",
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
        title: "Page 3",
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
  };

  const uiSchema = {
    "ui:components": {
      tupleField: MultiStepField,
    },
  } satisfies UiSchemaRoot;

  const form = createForm({
    ...defaults,
    schema,
    uiSchema,
    onSubmit: (data) => {
      console.log(data);
      form.reset();
      stepperCtx.current = 0;
    },
    onSubmitError(result, e, form) {
      if (result.errors.length === 0) {
        return;
      }
      step = result.errors[0].path[0] as number;
      createFocusOnFirstError()(result, e, form);
    },
  });
  setFormContext(form);
<\/script>

<Form attributes={{ novalidate: true }}>
  <Content />
</Form>
`,mt=`<script lang="ts" module>
  import { createContext } from "svelte";

  export const [getStepperContext, setStepperContext] =
    createContext<Ref<number>>();
<\/script>

<script lang="ts">
  import {
    getChildPath,
    getFieldComponent,
    getFormContext,
    retrieveTranslate,
    retrieveUiOption,
    retrieveUiSchema,
    uiTitleOption,
    type FieldValue,
    type ComponentProps,
    validate,
    updateErrors,
  } from "@sjsf/form";
  import { isSchemaObject } from "@sjsf/form/lib/json-schema";
  import type { Ref } from "@sjsf/form/lib/svelte.svelte";

  let { config, value = $bindable() }: ComponentProps["tupleField"] = $props();

  const ctx = getFormContext();
  const stepperCtx = getStepperContext();

  const stepSchemas = $derived.by(() => {
    const items = config.schema.items;
    return Array.isArray(items) && items.every(isSchemaObject) ? items : [];
  });
  const stepUiSchemas = $derived.by(() => {
    const items = config.uiSchema.items ?? {};
    return (Array.isArray(items) ? items : stepSchemas.map(() => items)).map(
      (s) => {
        const retrieved = retrieveUiSchema(ctx, s);
        return {
          ...retrieved,
          "ui:options": {
            ...retrieved["ui:options"],
            hideTitle: true,
          },
        };
      }
    );
  });
  const stepTitles = $derived(
    stepUiSchemas.map(
      (s, i) => uiTitleOption(ctx, s) ?? stepSchemas[i].title ?? \`Step \${i + 1}\`
    )
  );

  const stepConfig = $derived({
    path: getChildPath(ctx, config.path, stepperCtx.current),
    required: true,
    schema: stepSchemas[stepperCtx.current],
    uiSchema: stepUiSchemas[stepperCtx.current],
    title: stepTitles[stepperCtx.current],
  });
  const StepComponent = $derived(getFieldComponent(ctx, stepConfig));
<\/script>

<div class="stepper-header">
  {#each stepTitles as title, i}
    <button
      type="button"
      data-active={i === stepperCtx.current}
      onclick={() => {
        if (i < stepperCtx.current) {
          stepperCtx.current = i;
        }
      }}>{title}</button
    >
  {/each}
</div>

<StepComponent
  config={stepConfig}
  translate={retrieveTranslate(ctx, stepConfig)}
  type="field"
  uiOption={(opt) => retrieveUiOption(ctx, stepConfig, opt)}
  bind:value={
    () => value?.[stepperCtx.current] as undefined,
    (v) => {
      if (value) {
        value[stepperCtx.current] = v;
      } else {
        const arr = new Array<FieldValue>(stepSchemas.length);
        arr[stepperCtx.current] = v;
        value = arr;
      }
    }
  }
/>

<div class="stepper-buttons">
  <button
    type="button"
    data-active={stepperCtx.current > 0}
    onclick={() => {
      stepperCtx.current--;
    }}
  >
    Back
  </button>
  <button
    type="button"
    data-active={stepperCtx.current < stepSchemas.length - 1}
    onclick={() => {
      const { errors } = validate(ctx);
      const s = stepperCtx.current;
      const currentErrors = errors?.filter((e) => e.path[0] === s);
      if (currentErrors?.length) {
        updateErrors(ctx, currentErrors);
      } else {
        stepperCtx.current++;
      }
    }}
  >
    Continue
  </button>
  <button
    type="submit"
    data-active={stepperCtx.current === stepSchemas.length - 1}
  >
    Submit
  </button>
</div>

<style>
  .stepper-header {
    display: flex;
    gap: 1rem;
    > button {
      all: unset;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      border: 1px solid black;
      border-radius: 10px;
      padding: 0.5rem;
      cursor: pointer;
    }
    > [data-active="true"] {
      font-weight: bold;
    }
  }
  .stepper-buttons {
    display: flex;
    gap: 1rem;
    > button {
      flex-grow: 1;
      padding: 0.5rem;
    }
    > [data-active="false"] {
      display: none;
    }
  }
</style>
`,ht=e({default:()=>gt,meta:()=>N}),N=r({category:o.UiExtension,title:`Multi-step`,description:`Multi-step wizard form with navigation.`,tags:[s.Layout]}),gt=a({files:{"src/routes/+page.svelte":pt,"src/routes/multi-step-field.svelte":mt}}),_t=`<script lang="ts">
  import {
    createForm,
    BasicForm,
    type Schema,
    type FormState,
    type ResolveFieldType,
    getValueSnapshot,
  } from "@sjsf/form";
  import { extendByRecord } from "@sjsf/form/lib/resolver";

  import * as defaults from "$lib/sjsf/defaults";

  import nullableField, { isNullableField } from "./nullable-field.svelte";

  const schema = {
    type: "object",
    title: "Nullable fields",
    properties: {
      foo: {
        anyOf: [
          {
            type: "string",
            title: "Foo",
          },
          {
            type: "null",
          },
        ],
      },
      bar: {
        anyOf: [
          {
            type: "null",
          },
          {
            type: "number",
            title: "Bar",
          },
        ],
      },
      baz: {
        anyOf: [
          {
            type: "object",
            title: "Nested",
            properties: {
              hello: {
                type: "boolean",
              },
            },
          },
          {
            type: "null",
          },
        ],
      },
    },
    required: ["foo"],
  } as const satisfies Schema;

  function resolver<T>(ctx: FormState<T>): ResolveFieldType {
    const resolve = defaults.resolver(ctx);
    return (config) => {
      if (isNullableField(config.schema)) {
        return "nullableField";
      }
      return resolve(config);
    };
  }

  const form = createForm({
    ...defaults,
    theme: extendByRecord(defaults.theme, {
      nullableField,
    }),
    resolver,
    schema,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} novalidate />

<pre><code>{JSON.stringify(getValueSnapshot(form), null, 2)}</code></pre>
`,vt=`<script lang="ts" module>
  import type {
    Config,
    FieldCommonProps,
    SchemaValue,
    Schema,
  } from "@sjsf/form";
  import { isSchemaObject } from "@sjsf/form/lib/json-schema";
  import "@sjsf/form/extra-labels/clear";
  import "@sjsf/form/extra-labels/edit";

  declare module "@sjsf/form" {
    interface ComponentProps {
      nullableField: FieldCommonProps<SchemaValue>;
    }
    interface ComponentBindings {
      nullableField: "value";
    }
    interface FoundationalComponents {
      nullableField: {};
    }

    interface ButtonTypes {
      "clear-edit-action": {};
    }
  }

  export function isNullableField({ anyOf }: Schema) {
    if (anyOf?.length !== 2) {
      return false;
    }
    return anyOf.some((s) => isSchemaObject(s) && s.type === "null");
  }
<\/script>

<script lang="ts">
  import {
    type ComponentProps,
    getComponent,
    getFieldComponent,
    getFieldErrors,
    getFormContext,
    isDisabled,
    retrieveTranslate,
    retrieveUiOption,
    retrieveUiSchema,
    Text,
    getDefaultFieldState,
  } from "@sjsf/form";
  import {
    getSimpleSchemaType,
    isPrimitiveSchemaType,
    type SchemaDefinition,
  } from "@sjsf/form/core";
  import { isNil } from "@sjsf/form/lib/types";
  import OptionalArrayTemplate from "@sjsf/form/templates/extra/optional-array.svelte";
  import OptionalMultiFieldTemplate from "@sjsf/form/templates/extra/optional-multi-field.svelte";
  import OptionalObjectTemplate from "@sjsf/form/templates/extra/optional-object.svelte";

  let {
    value = $bindable(),
    config,
    translate,
  }: ComponentProps["nullableField"] = $props();

  const ctx = getFormContext();

  const fieldConfig: Config = $derived.by(() => {
    const nullIndex = config.schema.anyOf?.findIndex(
      (s) => isSchemaObject(s) && s.type === "null"
    );
    let schema: SchemaDefinition;
    if (
      config.schema.anyOf?.length !== 2 ||
      nullIndex === undefined ||
      nullIndex < 0 ||
      ((schema = config.schema.anyOf[1 - nullIndex]), !isSchemaObject(schema))
    ) {
      throw new Error(
        \`Invalid nullable field schema, expected '{ "anyOf": [{...}, { "type": "null" }] }', but got '\${JSON.stringify(config.schema)}'\`
      );
    }
    const uiSchema =
      config.uiSchema.anyOf?.length === 2
        ? retrieveUiSchema(ctx, config.uiSchema.anyOf[1 - nullIndex])
        : config.uiSchema;
    return {
      ...config,
      schema,
      uiSchema: {
        ...uiSchema,
        "ui:options": {
          action: clearEdit,
          ...uiSchema["ui:options"],
        },
        "ui:components": {
          objectTemplate: OptionalObjectTemplate,
          arrayTemplate: OptionalArrayTemplate,
          multiFieldTemplate: OptionalMultiFieldTemplate,
          ...uiSchema["ui:components"],
        },
      },
    };
  });
  const schemaType = $derived(getSimpleSchemaType(fieldConfig.schema));

  const Field = $derived(getFieldComponent(ctx, fieldConfig));
<\/script>

{#snippet clearEdit()}
  {@const Button = getComponent(ctx, "button", config)}
  {@const isUndefinedPrimitive =
    isPrimitiveSchemaType(schemaType) && isNil(value)}
  <Button
    type="clear-edit-action"
    {config}
    disabled={isUndefinedPrimitive || config.schema.readOnly || isDisabled(ctx)}
    errors={getFieldErrors(ctx, config.path)}
    onclick={() => {
      value = isNil(value)
        ? getDefaultFieldState(ctx, {
            schema: fieldConfig.schema,
            formData: undefined,
            includeUndefinedValues: "excludeObjectChildren",
          })
        : null;
    }}
  >
    <Text
      id={isUndefinedPrimitive || !isNil(value) ? "clear" : "edit"}
      {config}
      {translate}
    />
  </Button>
{/snippet}

<Field
  type="field"
  bind:value={value as undefined}
  config={fieldConfig}
  uiOption={(opt) => retrieveUiOption(ctx, fieldConfig, opt)}
  translate={retrieveTranslate(ctx, fieldConfig)}
/>
`,yt=e({default:()=>bt,meta:()=>P}),P=r({category:o.LogicExtension,title:`Nullable Fields`,description:`Custom nullable field component for null value states.`,tags:[s.CustomComponent]}),bt=a({files:{"src/routes/+page.svelte":_t,"src/routes/nullable-field.svelte":vt}}),xt=`<script lang="ts">
  import {
    createForm,
    BasicForm,
    type Schema,
    type Config,
    type ActionField,
  } from "@sjsf/form";
  import { getSimpleSchemaType } from "@sjsf/form/core";
  import { clearEdit } from "@sjsf/form/fields/actions/clear-edit.svelte";
  import { chain, fromFactories } from "@sjsf/form/lib/resolver";
  import OptionalArrayTemplate from "@sjsf/form/templates/extra/optional-array.svelte";
  import OptionalMultiFieldTemplate from "@sjsf/form/templates/extra/optional-multi-field.svelte";
  import OptionalObjectTemplate from "@sjsf/form/templates/extra/optional-object.svelte";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = {
    title: "test",
    properties: {
      nestedObjectOptional: {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
          deepObjectOptional: {
            type: "object",
            properties: {
              deepTest: {
                type: "string",
              },
            },
          },
          deepObject: {
            type: "object",
            properties: {
              deepTest: {
                type: "string",
              },
            },
          },
          deepArrayOptional: {
            type: "array",
            items: {
              type: "string",
            },
          },
          deepArrayOptional2: {
            type: "array",
            items: {
              type: "string",
            },
          },
          deepArray: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: ["deepObject", "deepArray"],
      },
      nestedArrayOptional: {
        type: "array",
        items: {
          type: "string",
        },
      },
      nestedObject: {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
        },
      },
      nestedArray: {
        type: "array",
        items: {
          type: "string",
        },
      },
      optionalObjectWithOneofs: {
        oneOf: [
          {
            type: "object",
            properties: {
              name: {
                type: "string",
                default: "first_option",
                readOnly: true,
              },
            },
          },
          {
            type: "object",
            properties: {
              name: {
                type: "string",
                default: "second_option",
                readOnly: true,
              },
              flag: {
                type: "boolean",
                default: false,
              },
            },
          },
          {
            type: "object",
            properties: {
              name: {
                type: "string",
                default: "third_option",
                readOnly: true,
              },
              flag: {
                type: "boolean",
                default: false,
              },
              inner_obj: {
                type: "object",
                properties: {
                  foo: {
                    type: "string",
                  },
                },
              },
            },
          },
        ],
      },
      optionalArrayWithAnyofs: {
        anyOf: [
          {
            type: "array",
            items: {
              type: "string",
            },
          },
          {
            type: "array",
            items: {
              type: "number",
            },
          },
          {
            type: "array",
            items: {
              type: "object",
              properties: {
                test: {
                  type: "string",
                },
              },
            },
          },
        ],
      },
    },
    required: ["nestedObject", "nestedArray"],
  } as const satisfies Schema;

  const theme = chain(
    fromFactories({
      objectTemplate: (cfg: Config) =>
        !cfg.required && cfg.schema.properties
          ? OptionalObjectTemplate
          : undefined,
      arrayTemplate: (cfg: Config) =>
        !cfg.required ? OptionalArrayTemplate : undefined,
      multiFieldTemplate: (cfg: Config) =>
        !cfg.required ? OptionalMultiFieldTemplate : undefined,
    }),
    defaults.theme
  );

  const extraUiOptions = fromFactories({
    actions: ({ required, schema }: Config) => {
      if (!required) {
        let key: ActionField | undefined;
        if (schema.oneOf) {
          key = "oneOfField";
        } else if (schema.anyOf) {
          key = "anyOfField";
        } else {
          const type = getSimpleSchemaType(schema);
          if (type === "array") {
            key = "arrayField";
          } else if (type === "object" && schema.properties) {
            key = "objectField";
          }
        }
        if (key) {
          return { [key]: clearEdit };
        }
      }
      return undefined;
    },
  });

  const form = createForm({
    ...defaults,
    theme,
    schema,
    extraUiOptions,
    merger: (options) =>
      defaults.merger({
        ...options,
        emptyObjectFields: "populateRequiredDefaults",
      }),
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
`,St=e({default:()=>Ct,meta:()=>F}),F=r({category:o.LogicExtension,title:`Optional Data Controls`,description:`Controlling optional field behavior and appearance.`,tags:[s.CustomComponent]}),Ct=a({files:{"src/routes/+page.svelte":xt}}),wt=`<script lang="ts">
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchemaRoot,
  } from "@sjsf/form";
  import { createPatternPropertyKeyValidator } from "@sjsf/form/validators/properties";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = {
    title: "Pattern properties",
    type: "object",
    additionalProperties: false,
    patternProperties: {
      "^[a-z][a-zA-Z0-9_]+$": {
        type: "string",
      },
    },
  } as const satisfies Schema;

  const uiSchema: UiSchemaRoot = {
    "ui:options": {
      translations: {
        "add-object-property": "Add pattern property",
        "additional-property": "patternProperty",
      },
      // NOTE: You can use \`additionalPropertyKey\` to ensure that each generated key is valid
      additionalPropertyKey: (key, attempt) =>
        attempt === 0 ? key : \`\${key}_\${attempt}\`,
    },
  };

  const form = createForm({
    ...defaults,
    validator: (options) => ({
      ...defaults.validator(options),
      ...createPatternPropertyKeyValidator(({ patternProperties }) => {
        const keys = Object.keys(patternProperties);
        return \`Must match "\${keys.length < 2 ? keys[0] : keys.join('" or "')}"\`;
      }),
    }),
    schema,
    uiSchema,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
`,Tt=e({default:()=>Et,meta:()=>I}),I=r({category:o.LogicExtension,title:`Pattern Properties Validator`,description:`Custom field component with validation logic for patternProperties.`,tags:[s.CustomComponent]}),Et=a({files:{"src/routes/+page.svelte":wt}}),Dt=`<script lang="ts">
  import { onMount } from "svelte";
  import { SvelteSet } from "svelte/reactivity";

  import Form from "./form.svelte";

  const files = new SvelteSet<string>();
  onMount(async () => {
    const root = await navigator.storage.getDirectory();
    for await (const [name, handle] of root) {
      if (handle.kind === "file") {
        files.add(name);
      }
    }
  });
<\/script>

<p>Open form with uploaded file:</p>
<div style="display: flex; gap: 1rem; padding-bottom: 1rem;">
  {#each files as f (f)}
    <a href={f}>{f}</a>
  {:else}
    <p>Upload at least 1 file</p>
  {/each}
</div>

<Form onFileCreated={(key) => files.add(key)} />
`,Ot=`<script lang="ts">
  import Form from "../form.svelte";
  import type { PageProps } from "./$types";

  let { params }: PageProps = $props();
<\/script>

<Form initialValue={{ file: params.id }} />
`,kt=`import { createContext } from "svelte";

export interface StoreContext {
  storeFile: (signal: AbortSignal, file: File) => Promise<string>;
  retrieveFile: (signal: AbortSignal, key: string) => Promise<File>;
}

export const [getStoreContext, setStoreContext] = createContext<StoreContext>();
`,At=`<script lang="ts">
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchemaRoot,
  } from "@sjsf/form";

  import * as defaults from "$lib/sjsf/defaults";

  import { setStoreContext } from "./context";
  import StoredFileField from "./stored-file-field.svelte";

  const {
    initialValue,
    onFileCreated,
  }: {
    initialValue?: { file: string };
    onFileCreated?: (key: string) => void;
  } = $props();

  const schema = {
    type: "object",
    title: "File form",
    properties: {
      file: {
        title: "File",
        type: "string",
      },
    },
    required: ["file"],
  } as const satisfies Schema;

  const uiSchema: UiSchemaRoot = {
    file: {
      "ui:components": {
        stringField: StoredFileField,
      },
    },
  };

  const form = createForm({
    ...defaults,
    get initialValue() {
      return initialValue;
    },
    schema,
    uiSchema,
    onSubmit: console.log,
  });

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setStoreContext({
    async storeFile(_, file) {
      const root = await navigator.storage.getDirectory();
      const key = file.name;
      const handle = await root.getFileHandle(key, { create: true });
      const writable = await handle.createWritable();
      await writable.write(file);
      await writable.close();
      await sleep(2000);
      onFileCreated?.(key);
      return key;
    },
    async retrieveFile(_, key) {
      const root = await navigator.storage.getDirectory();
      const handle = await root.getFileHandle(key);
      const file = await handle.getFile();
      await sleep(2000);
      return file;
    },
  });
<\/script>

<BasicForm {form} />
`,jt=`<script lang="ts" module>
  declare module "@sjsf/form" {
    interface FoundationalComponents {
      fileWidget: {};
    }
  }
<\/script>

<script lang="ts">
  import {
    makeEventHandlers,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
    validateFileList,
    FileListValidationError,
    getFieldErrors,
  } from "@sjsf/form";
  import { createAsyncBinding } from "@sjsf/form/lib/svelte.svelte";
  import "@sjsf/form/fields/extra-widgets/file";

  import { getStoreContext } from "./context";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps["stringField"] = $props();

  const ctx = getFormContext();
  const storeCtx = getStoreContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const widgetType = "fileWidget";
  const Widget = $derived(getComponent(ctx, widgetType, config));

  const handlers = makeEventHandlers(
    ctx,
    () => config,
    () => validateField(ctx, config, value)
  );

  const files = createAsyncBinding({
    initialOutput: undefined,
    getInput: () => value,
    setInput: (v) => (value = v),
    async toOutput(signal, value) {
      const data = new DataTransfer();
      if (value) {
        data.items.add(await storeCtx.retrieveFile(signal, value));
      }
      return data.files;
    },
    async toInput(signal, files) {
      if (files === undefined || files.length === 0) {
        return undefined;
      }
      if (!(await validateFileList(signal, ctx, config, files))) {
        throw new FileListValidationError();
      }
      return await storeCtx.storeFile(signal, files[0]!);
    },
  });

  const errors = $derived(getFieldErrors(ctx, config.path));
<\/script>

<Template
  type="template"
  showTitle
  useLabel
  {uiOption}
  {widgetType}
  {value}
  {config}
  {errors}
>
  <Widget
    type="widget"
    bind:value={files.current}
    processing={files.inputProcessing}
    loading={files.outputProcessing}
    {uiOption}
    {handlers}
    {errors}
    {config}
    multiple={false}
  />
</Template>

<style>
  /* Show a spinner or subtle overlay when the input is uploading/loading */
  :global([type="file"][data-loading="true"]) {
    position: relative;
    cursor: wait; /* show busy cursor */
  }

  /* Add a pseudo-element for visual indicator */
  :global([type="file"][data-loading="true"]::after) {
    content: "⏳"; /* hourglass emoji for loading */
    position: absolute;
    top: 50%;
    right: 0.5em;
    transform: translateY(-50%);
    pointer-events: none; /* don't block clicks */
    font-size: 1.2em;
  }

  /* Show processing state separately */
  :global([type="file"][data-processing="true"]) {
    position: relative;
    cursor: progress; /* indicates active work */
  }

  /* Optional: pseudo-element for processing indicator */
  :global([type="file"][data-processing="true"]::after) {
    content: "⚙️"; /* gear emoji for processing */
    position: absolute;
    top: 50%;
    right: 0.5em;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 1.2em;
    animation: spin 1s linear infinite; /* spinning gear effect */
  }

  :global(
    input[type="file"][data-loading="true"],
    input[type="file"][data-processing="true"]
  ) {
    pointer-events: none; /* block clicks */
    opacity: 0.6; /* visually dim */
    cursor: not-allowed; /* show forbidden cursor */
  }

  /* Simple spin animation */
  @keyframes spin {
    from {
      transform: translateY(-50%) rotate(0deg);
    }
    to {
      transform: translateY(-50%) rotate(360deg);
    }
  }
</style>
`,Mt=e({default:()=>Nt,meta:()=>L}),L=r({category:o.LogicExtension,title:`Pre-upload File`,description:`Custom file upload widget with client-side preview before submission.`,tags:[s.CustomComponent]}),Nt=a({widgets:[`file`],files:{"src/routes/+page.svelte":Dt,"src/routes/[id]/+page.svelte":Ot,"src/routes/context.ts":kt,"src/routes/form.svelte":At,"src/routes/stored-file-field.svelte":jt}}),Pt=`<script lang="ts" module>
  import type { EnumOption, SchemaValue } from "@sjsf/form/core";
  import type { Query } from "@sjsf/form/lib/task.svelte";

  declare module "@sjsf/form/fields/extra/remote-enum.svelte" {
    interface EnumOptionsQueries {
      foo: Query<[string], EnumOption<SchemaValue>[]>;
    }
  }
<\/script>

<script lang="ts">
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchema,
    getValueSnapshot,
  } from "@sjsf/form";
  import remoteEnumField, {
    setEnumOptionsQueriesContext,
    type EnumOptionsQueries,
  } from "@sjsf/form/fields/extra/remote-enum.svelte";
  import { extendByRecord } from "@sjsf/form/lib/resolver";
  import { createQuery, debounce } from "@sjsf/form/lib/task.svelte";
  import { StringEnumValueMapperBuilder } from "@sjsf/form/options.svelte";

  import * as defaults from "$lib/sjsf/defaults";

  import comboboxWidget from "./combobox.svelte";
  import { COUNTRIES } from "./countries";

  const options: EnumOption<SchemaValue>[] = COUNTRIES.map((c) => ({
    id: crypto.randomUUID(),
    disabled: false,
    label: c,
    value: c,
  }));

  const foo: EnumOptionsQueries["foo"] = createQuery({
    execute: debounce(async (s, filter) => {
      await new Promise((r) => setTimeout(r, 800));
      if (s.aborted || filter.length < 3) {
        return [];
      }
      const prefix = filter.trim().toLocaleLowerCase();
      return options.filter((o) =>
        o.label.toLocaleLowerCase().includes(prefix)
      );
    }),
  });

  setEnumOptionsQueriesContext({
    foo,
  });

  const schema = {
    title: "Search",
    type: "string",
  } as const satisfies Schema;

  const uiSchema: UiSchema = {
    "ui:components": {
      stringField: "remoteEnumField",
      selectWidget: "comboboxWidget",
    },
    "ui:options": {
      enumOptionsQuery: "foo",
      enumValueMapperBuilder: () => new StringEnumValueMapperBuilder(),
    },
  };

  const form = createForm({
    ...defaults,
    theme: extendByRecord(defaults.theme, {
      remoteEnumField,
      comboboxWidget,
    }),
    schema,
    uiSchema,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />

<p>{getValueSnapshot(form) || "<no value>"}</p>
`,Ft=`<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-widgets/combobox";

  declare module "@sjsf/form" {
    interface UiOptions {
      myCombobox?: HTMLInputAttributes;
    }
  }
<\/script>

<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import {
    getEnumOptionsQueriesContext,
    getEnumOptionsQuery,
  } from "@sjsf/form/fields/extra/remote-enum.svelte";
  import { idMapper, singleOption } from "@sjsf/form/options.svelte";

  let {
    value = $bindable(),
    config,
    options,
    handlers,
    mapped = singleOption({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["comboboxWidget"] = $props();

  const ctx = getFormContext();
  const queries = getEnumOptionsQueriesContext();
  const query = $derived(getEnumOptionsQuery(queries, "foo"));

  let input = $state.raw("");
<\/script>

<div class="combobox">
  <input
    {...inputAttributes(ctx, config, "myCombobox", handlers, {
      type: "search",
      autocomplete: "off",
    })}
    bind:value={
      () => mapped.current || input,
      (v) => {
        mapped.current = v;
        input = v;
        query.runAsync(v).then(
          () => (mapped.current = input),
          () => {}
        );
      }
    }
  />
  {#if !mapped.current}
    {#if query.isProcessed}
      <div>Loading...</div>
    {:else}
      {#each options as option (option.id)}
        <button
          type="button"
          onclick={() => {
            // mapped.current = option.mappedValue ?? option.id
            // is equivalent to
            value = structuredClone(option.value);
          }}>{option.label}</button
        >
      {/each}
    {/if}
  {/if}
</div>

<style>
  .combobox {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
`,It=`export const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Brazzaville)",
  "Congo (Kinshasa)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea (North)",
  "Korea (South)",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];
`,Lt=e({default:()=>Rt,meta:()=>R}),R=r({category:o.LogicExtension,title:`Remote Enum`,description:`Async enum options loaded from a remote source.`,tags:[s.Enum]}),Rt=a({files:{"src/routes/countries.ts":It,"src/routes/+page.svelte":Pt,"src/routes/async-combobox.svelte":Ft}}),zt=`export const trailingSlash = "always";
`,Bt=`<script lang="ts">
  import { getResults } from "./data.remote";

  const results = $derived(await getResults());
<\/script>

<div class="center">
  <a href="./foo">Foo form</a>
  <a href="./bar">Bar form</a>
  <p>Results:</p>
  <pre><code>{JSON.stringify(results, null, 2)}</code></pre>
</div>

<style>
  .center {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
</style>
`,Vt=`<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import { page } from "$app/state";
  import * as defaults from "$lib/sjsf/remote-defaults";

  import { createResult, getCurrentSchema } from "../data.remote";

  const schema = await getCurrentSchema(page.params.id);

  const form = createForm(
    await connect(createResult, {
      ...defaults,
      schema,
    })
  );
<\/script>

<BasicForm {form} novalidate />
`,Ht=`import { createServerValidator } from "@sjsf/sveltekit/rf/server";
import { error, invalid, redirect } from "@sveltejs/kit";

import { form, getRequestEvent, query } from "$app/server";
import { loadResults, loadSchemaById, saveResult } from "$lib/server";
import * as defaults from "$lib/sjsf/remote-defaults";

export const getResults = query(loadResults);

export const getCurrentSchema = query("unchecked", async (id) => {
  const schema = typeof id === "string" && (await loadSchemaById(id));
  if (!schema) {
    error(404);
  }
  return schema;
});

export const createResult = form("unchecked", async (data) => {
  const { params } = getRequestEvent();
  const schema = params.id && (await loadSchemaById(params.id));
  if (!schema) {
    error(404);
  }
  const validator = createServerValidator({
    ...defaults,
    schema,
  });
  const result = await validator.validate(data);
  if (result.issues) {
    invalid(...result.issues);
  }
  await saveResult(result.value.data);
  await getResults().refresh();
  redirect(303, "..");
});
`,Ut=e({default:()=>Wt,meta:()=>z}),z=r({category:o.SvelteKitIntegrations,title:`Remote Functions Dynamic Schema`,description:`Dynamic schemas combined with SvelteKit remote functions.`,tags:[s.RemoteFunctions]}),Wt=a({sveltekit:`remoteFunctions`,files:{"src/lib/server.ts":u,"src/routes/+layout.ts":zt,"src/routes/+page.svelte":Bt,"src/routes/data.remote.ts":Ht,"src/routes/[id]/+page.svelte":Vt},codeTransformers:[i]}),Gt=`<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import type { CreatePost } from "$lib/post";
  import * as defaults from "$lib/sjsf/remote-defaults";

  import { createPost, getInitialData } from "./data.remote";

  const initialData = await getInitialData();

  createPost.enhance(async ({ submit }) => {
    if (await submit()) {
      console.log(createPost.result);
      form.reset();
    }
  });

  const form = createForm(
    await connect<CreatePost>(createPost, {
      ...defaults,
      ...initialData,
    })
  );
<\/script>

<BasicForm {form} novalidate />
`,Kt=`import type { InitialFormData } from "@sjsf/sveltekit";
import { createServerValidator } from "@sjsf/sveltekit/rf/server";
import { invalid } from "@sveltejs/kit";

import { form, query } from "$app/server";
import { schema, type CreatePost } from "$lib/post";
import * as defaults from "$lib/sjsf/remote-defaults";

export const getInitialData = query(async () => {
  return {
    schema,
    initialValue: { title: "New post", content: "" },
  } satisfies InitialFormData<CreatePost>;
});

export const createPost = form(
  createServerValidator<CreatePost>({
    ...defaults,
    schema,
  }),
  ({ data }) => {
    if (data.title.length > 100) {
      invalid({ path: ["title"], message: "Title is too long" });
    }
    console.log(data);
    return { ...data, id: "new-post" };
  }
);
`,qt=e({default:()=>Jt,meta:()=>B}),B=r({category:o.SvelteKitIntegrations,title:`Remote Functions Enhance`,description:`Progressively enhanced remote functions.`,tags:[s.RemoteFunctions]}),Jt=a({sveltekit:`remoteFunctions`,files:{"src/lib/post.ts":d,"src/routes/data.remote.ts":Kt,"src/routes/+page.svelte":Gt},codeTransformers:[i]}),Yt=`<script lang="ts">
  import { connect } from "@sjsf/sveltekit/rf/client";

  import * as defaults from "$lib/sjsf/remote-defaults";

  import { createPost, getInitialData } from "./data.remote";
  import FormContent from "./form-content.svelte";

  const initialData = await getInitialData();

  const formOptions = await connect(createPost, {
    ...defaults,
    ...initialData,
  });
<\/script>

<!-- WARN: To prevent server-side validation errors from flickering or disappearing,
  JavaScript must be disabled (to prevent hydration).
  To do this, you’ll need to download this project and run it locally. -->
<form
  method={createPost.method}
  action={createPost.action}
  style="display: flex; flex-direction: column; gap: 1rem;"
  novalidate
>
  <FormContent {formOptions} />
</form>
`,Xt=`import type { InitialFormData } from "@sjsf/sveltekit";
import { createServerValidator } from "@sjsf/sveltekit/rf/server";
import { invalid } from "@sveltejs/kit";

import { form, query } from "$app/server";
import { schema, type CreatePost } from "$lib/post";
import * as defaults from "$lib/sjsf/remote-defaults";

export const getInitialData = query(async () => {
  return {
    schema,
    initialValue: { title: "New post", content: "" },
  } satisfies InitialFormData<CreatePost>;
});

export const createPost = form(
  createServerValidator<CreatePost>({
    ...defaults,
    schema,
  }),
  ({ data }) => {
    if (data.title.length > 100) {
      invalid({ path: ["title"], message: "Title is too long" });
    }
    console.log(data);
    return { ...data, id: "new-post" };
  }
);
`,Zt=`<script lang="ts">
  import {
    Content,
    createForm,
    setFormContext,
    SubmitButton,
    type FormOptions,
  } from "@sjsf/form";

  const { formOptions }: { formOptions: FormOptions<any> } = $props();

  const form = createForm(formOptions);
  setFormContext(form);
<\/script>

<Content />
<SubmitButton />
`,Qt=e({default:()=>$t,meta:()=>V}),V=r({category:o.SvelteKitIntegrations,title:`Remote Functions Without JS`,description:`Remote functions with JavaScript disabled.`,tags:[s.RemoteFunctions,s.NoJs]}),$t=a({sveltekit:`remoteFunctions`,files:{"src/lib/post.ts":d,"src/routes/data.remote.ts":Xt,"src/routes/+page.svelte":Yt,"src/routes/form-content.svelte":Zt},codeTransformers:[i]}),en=`<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { connect } from "@sjsf/sveltekit/rf/client";

  import type { CreatePost } from "$lib/post";
  import * as defaults from "$lib/sjsf/remote-defaults";

  import { createPost, getInitialData } from "./data.remote";

  const initialData = await getInitialData();

  const form = createForm(
    await connect<CreatePost>(createPost, {
      ...defaults,
      ...initialData,
    })
  );
<\/script>

<BasicForm {form} novalidate />
`,tn=`import type { InitialFormData } from "@sjsf/sveltekit";
import { createServerValidator } from "@sjsf/sveltekit/rf/server";
import { invalid } from "@sveltejs/kit";

import { form, query } from "$app/server";
import { schema, type CreatePost } from "$lib/post";
import * as defaults from "$lib/sjsf/remote-defaults";

export const getInitialData = query(async () => {
  return {
    schema,
    initialValue: { title: "New post", content: "" },
  } satisfies InitialFormData<CreatePost>;
});

export const createPost = form(
  createServerValidator<CreatePost>({
    ...defaults,
    schema,
  }),
  ({ data }) => {
    if (data.title.length > 100) {
      invalid({ path: ["title"], message: "Title is too long" });
    }
    console.log(data);
    return { ...data, id: "new-post" };
  }
);
`,nn=e({default:()=>rn,meta:()=>H}),H=r({category:o.SvelteKitIntegrations,title:`Remote Functions`,description:`SvelteKit remote functions for server-side logic.`,tags:[s.RemoteFunctions]}),rn=a({sveltekit:`remoteFunctions`,files:{"src/lib/post.ts":d,"src/routes/data.remote.ts":tn,"src/routes/+page.svelte":en},codeTransformers:[i]}),an=`<script lang="ts">
  import {
    SimpleForm,
    type Schema,
    type FormValue,
    type Config,
    type FormValueValidator,
  } from "@sjsf/form";
  import {
    isSelect,
    retrieveSchema,
    schemaHash,
    type SchemaDefinition,
  } from "@sjsf/form/core";
  import { HashedKeyCache, LRUCache } from "@sjsf/form/lib/cache";
  import {
    transformSchemaDefinition,
    isSchemaObject,
  } from "@sjsf/form/lib/json-schema";
  import { weakMemoize } from "@sjsf/form/lib/memoize";
  import { fromFactories } from "@sjsf/form/lib/resolver";
  import { omitExtraData } from "@sjsf/form/omit-extra-data";
  import { resolver } from "@sjsf/form/resolvers/compat";
  import "@sjsf/form/fields/extra/enum-include";

  // https://github.com/sveltejs/svelte/issues/17220
  import * as _defaults from "$lib/sjsf/defaults";

  const defaults = { ..._defaults };

  const originalSchema: Schema = {
    title: "favouriteThings",
    anyOf: [
      {
        type: "object",
        properties: {
          favouriteAnimal: {
            type: "string",
          },
          favouriteColour: {
            type: "string",
          },
        },
        required: ["favouriteAnimal"],
      },
      {
        type: "object",
        properties: {
          favouriteAnimal: {
            type: "string",
          },
          favouriteColour: {
            type: "string",
          },
          favouritePerson: {
            type: "string",
          },
        },
        required: ["favouriteAnimal", "favouriteColour"],
      },
      {
        type: "object",
        properties: {
          favouritePerson: {
            type: "string",
          },
        },
        required: ["favouritePerson"],
      },
    ],
  };

  const validator = defaults.validator<FormValue>({
    validatorsCache: new HashedKeyCache({
      getHash: weakMemoize(new WeakMap(), schemaHash),
      store: new LRUCache({
        maxSize: 10,
      }),
    }),
  });
  const merger = defaults.merger({
    validator,
    schema: originalSchema,
  });

  const VIRTUAL_PROPERTY = "__sjsf_virtual_property";
  const toOption = (def: SchemaDefinition, index: number) =>
    (isSchemaObject(def) && def.title) || \`Option \${index + 1}\`;

  const schema = transformSchemaDefinition<SchemaDefinition>(
    originalSchema,
    (copy) => {
      if (typeof copy === "boolean") {
        return copy;
      }
      const altKeyword = (copy.oneOf && "oneOf") ?? (copy.anyOf && "anyOf");
      const alt = altKeyword && copy[altKeyword];
      if (!alt || isSelect(validator, merger, copy, originalSchema)) {
        return copy;
      }
      const {
        [altKeyword]: _,
        properties = {},
        dependencies = {},
        required = [],
        ...rest
      } = copy;
      const options = alt.map(toOption);
      properties[VIRTUAL_PROPERTY] = {
        title: copy.title ?? "Options",
        enum: options,
        default: options[0],
      };
      dependencies[VIRTUAL_PROPERTY] = {
        oneOf: alt.map((def, i) => {
          const option: Schema = {
            properties: {
              [VIRTUAL_PROPERTY]: {
                const: toOption(def, i),
              },
            },
          };
          return typeof def === "boolean"
            ? option
            : merger.mergeSchemas(def, option);
        }),
      };
      return {
        ...rest,
        required: required.concat(VIRTUAL_PROPERTY),
        properties,
        dependencies,
      };
    }
  ) as Schema;
<\/script>

<SimpleForm
  {...defaults}
  {resolver}
  validator={{
    ...validator,
    validateFormValue(rootSchema, formValue) {
      const retrievedSchema = retrieveSchema(
        validator,
        merger,
        rootSchema,
        rootSchema,
        formValue
      );
      return validator.validateFormValue(retrievedSchema, formValue);
    },
  } satisfies FormValueValidator<FormValue>}
  {merger}
  {schema}
  uiSchema={{
    "ui:options": {
      form: {
        novalidate: true,
      },
    },
  }}
  onSubmit={(value) => {
    console.log(omitExtraData(validator, merger, originalSchema, value));
  }}
  extraUiOptions={fromFactories({
    hideTitle: ({ path }: Config) =>
      path.at(-1) === VIRTUAL_PROPERTY || undefined,
  })}
/>
`,on=e({default:()=>sn,meta:()=>U}),U=r({category:o.LogicExtension,title:`Schema Transformation`,description:`JSON Schema transformation before form rendering.`,tags:[s.Schema]}),sn=a({files:{"src/routes/+page.svelte":an}}),cn=`<script lang="ts">
  import { createForm, BasicForm, type Schema } from "@sjsf/form";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = {
    type: "object",
    title: "Basic form",
    properties: {
      hello: {
        title: "Hello",
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
<\/script>

<BasicForm {form} />
`,ln=e({default:()=>un,meta:()=>W}),W=r({category:o.Starters,title:`Basic Starter`,description:`Basic JSON Schema form setup with Svelte.`,tags:[]}),un=a({files:{"src/routes/+page.svelte":cn}}),dn=`import type { PathTrieRef } from "@sjsf/form";
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
`,fn=`import type { FailureValidationResult, FormState } from "@sjsf/form";
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
`,pn=`export * from "./context.svelte";
export * from "./focus";
export * from "./schema";
export { default as Layout } from "./layout.svelte";
`,mn=`<script lang="ts">
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
`,hn=`import type { Schema } from "@sjsf/form";

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
`,gn=`<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";
  import { getValueByKeys } from "@sjsf/form/lib/trie";

  import { getTabsContext } from "./context.svelte";

  const { children, config }: ComponentProps["layout"] = $props();
  const tabsCtx = getTabsContext();

  const node = getValueByKeys(tabsCtx.current, config.path.slice(0, -1));
  node?.tabs.push(children);
<\/script>
`,_n=`<script lang="ts">
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
`,vn=`<script lang="ts">
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
`,yn=`<script lang="ts">
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
`,bn=`<script lang="ts">
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
`,xn=e({default:()=>Sn,meta:()=>G}),G=r({category:o.UiExtension,title:`Tabbed Layout`,description:`Custom tabbed layout for form sections.`,tags:[s.Layout]}),Sn=a({files:{"src/lib/tabs/context.svelte.ts":dn,"src/lib/tabs/layout.svelte":mn,"src/lib/tabs/schema.ts":hn,"src/lib/tabs/tabs.svelte":_n,"src/lib/tabs/focus.ts":fn,"src/lib/tabs/tab.svelte":gn,"src/lib/tabs/index.ts":pn,"src/routes/sub-tabs.svelte":yn,"src/routes/+page.svelte":vn,"src/routes/top-tabs.svelte":bn},fields:[`enum`]}),Cn=`/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import { type Static, type TSchema } from "typebox";
import { type TLocalizedValidationError } from "typebox/error";
import { Guard } from "typebox/guard";
import { Validator } from "typebox/schema";

// ------------------------------------------------------------------
// ErrorToIssue
// ------------------------------------------------------------------
function PathSegments(pointer: string): string[] {
  if (Guard.IsEqual(pointer.length, 0)) return [];
  return pointer
    .slice(1)
    .split("/")
    .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"));
}
function ErrorToIssue(
  error: TLocalizedValidationError
): StandardSchemaV1.Issue {
  const path = PathSegments(error.instancePath);
  return { path, message: error.message };
}
// ------------------------------------------------------------------
// StandardSchemaProps
// ------------------------------------------------------------------
export class StandardSchemaProps<Value>
  implements
    StandardSchemaV1.Props<Value, Value>,
    StandardJSONSchemaV1.Props<Value, Value>
{
  public readonly vendor = "typebox";
  public readonly version = 1;
  readonly #validator: Validator;
  public types?: StandardTypedV1.Types<Value, Value> | undefined;
  public jsonSchema: StandardJSONSchemaV1.Converter;
  constructor(type: TSchema) {
    this.#validator = new Validator({}, type);
    this.jsonSchema = {
      output: () => this.#validator.Schema() as Record<string, unknown>,
      input: () => this.#validator.Schema() as Record<string, unknown>,
    };
  }
  public validate = (
    value: unknown
  ):
    | StandardSchemaV1.Result<Value>
    | Promise<StandardSchemaV1.Result<Value>> => {
    if (this.#validator.Check(value)) return { value } as never;
    const [_result, errors] = this.#validator.Errors(value);
    const issues = errors.map((error) => ErrorToIssue(error));
    return { issues };
  };
}
// ------------------------------------------------------------------
// StandardSchema
// ------------------------------------------------------------------
export class StandardSchema<
  Type extends TSchema,
  out Value extends unknown = Static<Type>,
>
  implements StandardSchemaV1<Value>, StandardJSONSchemaV1<Value>
{
  "~standard": StandardSchemaV1.Props<Value, Value> &
    StandardJSONSchemaV1.Props<Value, Value>;
  constructor(type: Type) {
    this["~standard"] = new StandardSchemaProps(type);
  }
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Returns an implementation of Standard Schema + Standard JSON Schema */
export function StandardSchemaV1<const Type extends TSchema>(
  type: Type
): StandardSchema<Type> {
  return new StandardSchema(type);
}
// ------------------------------------------------------------------
// Standard Typed
// ------------------------------------------------------------------
/** The Standard Typed interface. This is a base type extended by other specs. */
export interface StandardTypedV1<Input = unknown, Output = Input> {
  /** The Standard properties. */
  readonly "~standard": StandardTypedV1.Props<Input, Output>;
}
export declare namespace StandardTypedV1 {
  /** The Standard Typed properties interface. */
  export interface Props<Input = unknown, Output = Input> {
    /** The version number of the standard. */
    readonly version: 1;
    /** The vendor name of the schema library. */
    readonly vendor: string;
    /** Inferred types associated with the schema. */
    readonly types?: Types<Input, Output> | undefined;
  }
  /** The Standard Typed types interface. */
  export interface Types<Input = unknown, Output = Input> {
    /** The input type of the schema. */
    readonly input: Input;
    /** The output type of the schema. */
    readonly output: Output;
  }
  /** Infers the input type of a Standard Typed. */
  export type InferInput<Schema extends StandardTypedV1> = NonNullable<
    Schema["~standard"]["types"]
  >["input"];
  /** Infers the output type of a Standard Typed. */
  export type InferOutput<Schema extends StandardTypedV1> = NonNullable<
    Schema["~standard"]["types"]
  >["output"];
}
// ------------------------------------------------------------------
// Standard Schema
// ------------------------------------------------------------------
/** The Standard Schema interface. */
export interface StandardSchemaV1<Input = unknown, Output = Input> {
  /** The Standard Schema properties. */
  readonly "~standard": StandardSchemaV1.Props<Input, Output>;
}
export declare namespace StandardSchemaV1 {
  /** The Standard Schema properties interface. */
  export interface Props<
    Input = unknown,
    Output = Input,
  > extends StandardTypedV1.Props<Input, Output> {
    /** Validates unknown input values. */
    readonly validate: (
      value: unknown,
      options?: StandardSchemaV1.Options | undefined
    ) => Result<Output> | Promise<Result<Output>>;
  }
  /** The result interface of the validate function. */
  export type Result<Output> = SuccessResult<Output> | FailureResult;
  /** The result interface if validation succeeds. */
  export interface SuccessResult<Output> {
    /** The typed output value. */
    readonly value: Output;
    /** A falsy value for \`issues\` indicates success. */
    readonly issues?: undefined;
  }
  export interface Options {
    /** Explicit support for additional vendor-specific parameters, if needed. */
    readonly libraryOptions?: Record<string, unknown> | undefined;
  }
  /** The result interface if validation fails. */
  export interface FailureResult {
    /** The issues of failed validation. */
    readonly issues: ReadonlyArray<Issue>;
  }
  /** The issue interface of the failure output. */
  export interface Issue {
    /** The error message of the issue. */
    readonly message: string;
    /** The path of the issue, if any. */
    readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined;
  }
  /** The path segment interface of the issue. */
  export interface PathSegment {
    /** The key representing a path segment. */
    readonly key: PropertyKey;
  }
  /** The Standard types interface. */
  export interface Types<
    Input = unknown,
    Output = Input,
  > extends StandardTypedV1.Types<Input, Output> {}
  /** Infers the input type of a Standard. */
  export type InferInput<Schema extends StandardTypedV1> =
    StandardTypedV1.InferInput<Schema>;
  /** Infers the output type of a Standard. */
  export type InferOutput<Schema extends StandardTypedV1> =
    StandardTypedV1.InferOutput<Schema>;
}
// ------------------------------------------------------------------
// Standard JSON Schema
// ------------------------------------------------------------------
/** The Standard JSON Schema interface. */
export interface StandardJSONSchemaV1<Input = unknown, Output = Input> {
  /** The Standard JSON Schema properties. */
  readonly "~standard": StandardJSONSchemaV1.Props<Input, Output>;
}
export declare namespace StandardJSONSchemaV1 {
  /** The Standard JSON Schema properties interface. */
  export interface Props<
    Input = unknown,
    Output = Input,
  > extends StandardTypedV1.Props<Input, Output> {
    /** Methods for generating the input/output JSON Schema. */
    readonly jsonSchema: StandardJSONSchemaV1.Converter;
  }
  /** The Standard JSON Schema converter interface. */
  export interface Converter {
    /** Converts the input type to JSON Schema. May throw if conversion is not supported. */
    readonly input: (
      options: StandardJSONSchemaV1.Options
    ) => Record<string, unknown>;
    /** Converts the output type to JSON Schema. May throw if conversion is not supported. */
    readonly output: (
      options: StandardJSONSchemaV1.Options
    ) => Record<string, unknown>;
  }
  /**
   * The target version of the generated JSON Schema.
   *
   * It is *strongly recommended* that implementers support \`"draft-2020-12"\` and \`"draft-07"\`, as they are both in wide use. All other targets can be implemented on a best-effort basis. Libraries should throw if they don't support a specified target.
   *
   * The \`"openapi-3.0"\` target is intended as a standardized specifier for OpenAPI 3.0 which is a superset of JSON Schema \`"draft-04"\`.
   */
  export type Target =
    | "draft-2020-12"
    | "draft-07"
    | "openapi-3.0"
    // Accepts any string for future targets while preserving autocomplete
    | ({} & string);

  /** The options for the input/output methods. */
  export interface Options {
    /** Specifies the target version of the generated JSON Schema. Support for all versions is on a best-effort basis. If a given version is not supported, the library should throw. */
    readonly target: Target;
    /** Explicit support for additional vendor-specific parameters, if needed. */
    readonly libraryOptions?: Record<string, unknown> | undefined;
  }
  /** The Standard types interface. */
  export interface Types<
    Input = unknown,
    Output = Input,
  > extends StandardTypedV1.Types<Input, Output> {}
  /** Infers the input type of a Standard. */
  export type InferInput<Schema extends StandardTypedV1> =
    StandardTypedV1.InferInput<Schema>;
  /** Infers the output type of a Standard. */
  export type InferOutput<Schema extends StandardTypedV1> =
    StandardTypedV1.InferOutput<Schema>;
}
`,wn=`<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from "@sjsf/form/validators/standard-schema";
  import Type from "typebox";

  import * as defaults from "$lib/sjsf/defaults";
  import { StandardSchemaV1 } from "$lib/standard";

  const schema = StandardSchemaV1(
    Type.Object({
      hello: Type.String(),
    })
  );

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    uiSchema: {
      "ui:options": {
        title: "Basic form",
      },
      hello: {
        "ui:options": {
          title: "Hello",
        },
      },
    },
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} novalidate />
`,Tn=e({default:()=>En,meta:()=>K}),K=r({category:o.Starters,title:`TypeBox Starter`,description:`TypeBox with standard-schema validator starter.`,tags:[],isValidatorSpecific:!0}),En=a({validator:`noop`,dependencies:[n(`typebox`)],files:{"src/routes/+page.svelte":wn,"src/lib/standard.ts":Cn}}),Dn=`<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from "@sjsf/valibot-validator";
  import * as v from "valibot";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = v.pipe(
    v.object({
      hello: v.string(),
    }),
    v.metadata({
      title: "Basic form",
    })
  );

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} novalidate />
`,On=e({default:()=>kn,meta:()=>q}),q=r({category:o.Starters,title:`Valibot Starter`,description:`Valibot validator integration starter.`,tags:[],isValidatorSpecific:!0}),kn=a({validator:`valibot`,files:{"src/routes/+page.svelte":Dn}}),An=`<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from "@sjsf/valibot-validator";
  import * as v from "valibot";

  import * as defaults from "$lib/sjsf/defaults";
  import unknownBigIntField from "$lib/unknown-big-int-field.svelte";
  import unknownDateField from "$lib/unknown-date-field.svelte";

  const schema = v.pipe(
    v.object({
      birthday: v.date(),
      id: v.bigint(),
    }),
    v.metadata({ title: "Unserializable fields" })
  );

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    uiSchema: {
      birthday: {
        "ui:components": {
          unknownField: unknownDateField,
        },
        "ui:options": {
          text: {
            type: "datetime-local",
          },
        },
      },
      id: {
        "ui:components": {
          unknownField: unknownBigIntField,
        },
      },
    },
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} novalidate />
`,jn=e({default:()=>Mn,meta:()=>J}),J=r({category:o.LogicExtension,title:`Valibot Unserializable`,description:`Valibot schema with unrepresentable types (Date, BigInt) handled via custom fields.`,tags:[s.CustomComponent],isValidatorSpecific:!0}),Mn=a({validator:`valibot`,files:{"src/routes/+page.svelte":An,"src/lib/unknown-date-field.svelte":p,"src/lib/unknown-big-int-field.svelte":f}}),Nn=`<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from "@sjsf/zod4-validator/classic";
  import * as z from "zod";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = z
    .object({
      hello: z.string().meta({ title: "Hello" }),
    })
    .meta({ title: "Basic form" });

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} novalidate />
`,Pn=e({default:()=>Fn,meta:()=>Y}),Y=r({category:o.Starters,title:`Zod Starter`,description:`Zod validator integration starter.`,tags:[],isValidatorSpecific:!0}),Fn=a({validator:`zod4`,files:{"src/routes/+page.svelte":Nn}}),In=`<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from "@sjsf/zod4-validator/classic";
  import * as z from "zod";

  import * as defaults from "$lib/sjsf/defaults";
  import unknownBigIntField from "$lib/unknown-big-int-field.svelte";
  import unknownDateField from "$lib/unknown-date-field.svelte";

  const schema = z
    .object({
      birthday: z.date().meta({ title: "Birthday" }),
      id: z.bigint().meta({ title: "ID" }),
    })
    .meta({ title: "Unserializable fields" });

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    uiSchema: {
      birthday: {
        "ui:components": {
          unknownField: unknownDateField,
        },
        "ui:options": {
          text: {
            type: "datetime-local",
          },
        },
      },
      id: {
        "ui:components": {
          unknownField: unknownBigIntField,
        },
      },
    },
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} novalidate />
`,Ln=e({default:()=>Z,meta:()=>X}),X=r({category:o.LogicExtension,title:`Zod Unserializable`,description:`Zod schema with unrepresentable types (Date, BigInt) handled via custom fields.`,tags:[s.CustomComponent],isValidatorSpecific:!0}),Z=a({validator:`zod4`,files:{"src/routes/+page.svelte":In,"src/lib/unknown-date-field.svelte":p,"src/lib/unknown-big-int-field.svelte":f}}),Rn=Object.assign({"./examples/ajv-i18n.js":g,"./examples/arktype-starter.js":_,"./examples/async-combobox.js":v,"./examples/decomposed-field.js":y,"./examples/deprecated-keyword.js":b,"./examples/draft-2020-12.js":x,"./examples/enum-widgets.js":S,"./examples/form-actions-dynamic-schema.js":w,"./examples/form-actions-flex.js":T,"./examples/form-actions-without-js.js":E,"./examples/form-actions.js":D,"./examples/formulas.js":O,"./examples/label-on-left.js":k,"./examples/layout-slots.js":A,"./examples/markdown-description.js":j,"./examples/multi-step-native-form.js":M,"./examples/multi-step.js":N,"./examples/nullable-fields.js":P,"./examples/optional-data-controls.js":F,"./examples/pattern-properties-validator.js":I,"./examples/preupload-file.js":L,"./examples/remote-enum.js":R,"./examples/remote-functions-dynamic-schema.js":z,"./examples/remote-functions-enhance.js":B,"./examples/remote-functions-without-js.js":V,"./examples/remote-functions.js":H,"./examples/schema-transformation.js":U,"./examples/starter.js":W,"./examples/tabbed-layout.js":G,"./examples/typebox-starter.js":K,"./examples/valibot-starter.js":q,"./examples/valibot-unserializable.js":J,"./examples/zod-starter.js":Y,"./examples/zod-unserializable.js":X}),Q=Object.assign({"./examples/ajv-i18n.js":()=>t(()=>Promise.resolve().then(()=>oe).then(e=>e.default),void 0),"./examples/arktype-starter.js":()=>t(()=>Promise.resolve().then(()=>le).then(e=>e.default),void 0),"./examples/async-combobox.js":()=>t(()=>Promise.resolve().then(()=>he).then(e=>e.default),void 0),"./examples/decomposed-field.js":()=>t(()=>Promise.resolve().then(()=>ve).then(e=>e.default),void 0),"./examples/deprecated-keyword.js":()=>t(()=>Promise.resolve().then(()=>xe).then(e=>e.default),void 0),"./examples/draft-2020-12.js":()=>t(()=>Promise.resolve().then(()=>we).then(e=>e.default),void 0),"./examples/enum-widgets.js":()=>t(()=>Promise.resolve().then(()=>Oe).then(e=>e.default),void 0),"./examples/form-actions-dynamic-schema.js":()=>t(()=>Promise.resolve().then(()=>Ne).then(e=>e.default),void 0),"./examples/form-actions-flex.js":()=>t(()=>Promise.resolve().then(()=>Le).then(e=>e.default),void 0),"./examples/form-actions-without-js.js":()=>t(()=>Promise.resolve().then(()=>Ve).then(e=>e.default),void 0),"./examples/form-actions.js":()=>t(()=>Promise.resolve().then(()=>Ge).then(e=>e.default),void 0),"./examples/formulas.js":()=>t(()=>Promise.resolve().then(()=>Ye).then(e=>e.default),void 0),"./examples/label-on-left.js":()=>t(()=>Promise.resolve().then(()=>Qe).then(e=>e.default),void 0),"./examples/layout-slots.js":()=>t(()=>Promise.resolve().then(()=>nt).then(e=>e.default),void 0),"./examples/markdown-description.js":()=>t(()=>Promise.resolve().then(()=>ot).then(e=>e.default),void 0),"./examples/multi-step-native-form.js":()=>t(()=>Promise.resolve().then(()=>dt).then(e=>e.default),void 0),"./examples/multi-step.js":()=>t(()=>Promise.resolve().then(()=>ht).then(e=>e.default),void 0),"./examples/nullable-fields.js":()=>t(()=>Promise.resolve().then(()=>yt).then(e=>e.default),void 0),"./examples/optional-data-controls.js":()=>t(()=>Promise.resolve().then(()=>St).then(e=>e.default),void 0),"./examples/pattern-properties-validator.js":()=>t(()=>Promise.resolve().then(()=>Tt).then(e=>e.default),void 0),"./examples/preupload-file.js":()=>t(()=>Promise.resolve().then(()=>Mt).then(e=>e.default),void 0),"./examples/remote-enum.js":()=>t(()=>Promise.resolve().then(()=>Lt).then(e=>e.default),void 0),"./examples/remote-functions-dynamic-schema.js":()=>t(()=>Promise.resolve().then(()=>Ut).then(e=>e.default),void 0),"./examples/remote-functions-enhance.js":()=>t(()=>Promise.resolve().then(()=>qt).then(e=>e.default),void 0),"./examples/remote-functions-without-js.js":()=>t(()=>Promise.resolve().then(()=>Qt).then(e=>e.default),void 0),"./examples/remote-functions.js":()=>t(()=>Promise.resolve().then(()=>nn).then(e=>e.default),void 0),"./examples/schema-transformation.js":()=>t(()=>Promise.resolve().then(()=>on).then(e=>e.default),void 0),"./examples/starter.js":()=>t(()=>Promise.resolve().then(()=>ln).then(e=>e.default),void 0),"./examples/tabbed-layout.js":()=>t(()=>Promise.resolve().then(()=>xn).then(e=>e.default),void 0),"./examples/typebox-starter.js":()=>t(()=>Promise.resolve().then(()=>Tn).then(e=>e.default),void 0),"./examples/valibot-starter.js":()=>t(()=>Promise.resolve().then(()=>On).then(e=>e.default),void 0),"./examples/valibot-unserializable.js":()=>t(()=>Promise.resolve().then(()=>jn).then(e=>e.default),void 0),"./examples/zod-starter.js":()=>t(()=>Promise.resolve().then(()=>Pn).then(e=>e.default),void 0),"./examples/zod-unserializable.js":()=>t(()=>Promise.resolve().then(()=>Ln).then(e=>e.default),void 0)}),$=Object.keys(Q).map(e=>({meta:Rn[e],path:e,load:Q[e]})).sort((e,t)=>e.meta.title.localeCompare(t.meta.title)),zn=Object.groupBy($,e=>e.meta.category),Bn={zod4:()=>t(()=>import(`./schema-to-zod.DCyekANx.js`),__vite__mapDeps([10,11,1,7,9])),valibot:()=>t(()=>import(`./schema-to-valibot.BVSXxt4g.js`),__vite__mapDeps([12,13,11,1,7,9])),"standard-schema":()=>t(()=>import(`./schema-to-standard-schema.CIFNjN1t.js`),__vite__mapDeps([14,11,1,7,9]))};async function Vn({name:e,entry:t,themeOrSubTheme:n,validator:r}){let{meta:i,load:a}=t,o=await a(),s=i.isValidatorSpecific??!1,u=o.codeTransformers;if(!s){let e=Bn[r]?.();e&&(u=u.concat((await e).default))}return await l({...c,name:e,icons:`none`,themeOrSubTheme:n,validator:{name:s?o.validator:r,draft2020:!1,precompiled:!1},sveltekit:o.sveltekit,fields:o.fields,widgets:o.widgets,extraFiles:o.files,extraDependencies:o.dependencies,codeTransformers:u})}async function Hn(e){let{entry:{meta:t},themeOrSubTheme:n,validator:r}=e,i=`${t.title} (${n}, ${r})`,a=await Vn({...e,name:i});await h({name:i,platform:e.platform,files:a})}export{te as a,ne as c,ie as i,zn as n,ee as o,Hn as r,m as s,$ as t};