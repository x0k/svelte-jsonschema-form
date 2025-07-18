import{o as n}from"./advanced-examples.CXKDeUyS.js";import"./_commonjsHelpers.DqMlsjy1.js";import"./render.CikkzK1I.js";import"./function.oytMJMKu.js";import"./shared.y3pRYwqI.js";import"./preload-helper.BUFao3bW.js";import"./buttons.C_2Ph5Rm.js";/* empty css                                                       *//* empty css                                                                 */const e="async-combobox",t="0.0.1",i="module",o={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},a={"@sveltejs/adapter-auto":"^6.0.0","@sveltejs/kit":"^2.16.0","@sveltejs/vite-plugin-svelte":"^5.0.0",svelte:"^5.33.0","svelte-check":"^4.0.0",typescript:"^5.0.0",vite:"^6.2.6"},r={"@sjsf/ajv8-validator":"^2.0.0","@sjsf/basic-theme":"^2.0.0","@sjsf/form":"^2.0.0",ajv:"^8.17.1","esm-env":"^1.2.0"},s={name:e,private:!0,version:t,type:i,scripts:o,devDependencies:a,dependencies:r},l=`export const COUNTRIES = [
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
`,c=`<script lang="ts">
  import { BROWSER } from "esm-env";
  import { identity } from "@sjsf/form/lib/function";
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchemaRoot,
    type AsyncFormValueValidator,
    type FormValueValidatorError,
    pathToId,
  } from "@sjsf/form";

  import * as defaults from "$lib/form-defaults";

  import { COUNTRIES } from "./countries";
  import AsyncComboboxWidget, {
    type MyAsyncComboboxOptions,
  } from "./async-combobox-widget.svelte";

  async function searchFn(signal: AbortSignal, query: string) {
    const promise = Promise.withResolvers<string[]>();
    const id = setTimeout(
      () =>
        promise.resolve(
          COUNTRIES.filter((c) =>
            c.toLocaleLowerCase().includes(query.toLocaleLowerCase())
          )
        ),
      1000
    );
    const onAbort = () => {
      clearTimeout(id);
      promise.reject(
        new DOMException("The operation was aborted.", "AbortError")
      );
    };
    signal.addEventListener("abort", onAbort);
    return promise.promise.finally(() => {
      signal.removeEventListener("abort", onAbort);
    });
  }

  class InvalidCountry {}

  const validator = {
    ...defaults.validator,
    async validateFormValueAsync(signal, rootSchema, formValue) {
      const errors = defaults.validator.validateFormValue(
        rootSchema,
        formValue
      );
      if (errors.length > 0) {
        return errors;
      }
      if (typeof formValue === "string") {
        const countries = await searchFn(signal, formValue);
        if (countries.includes(formValue)) {
          return [];
        }
      }
      return [
        {
          instanceId: pathToId([]),
          propertyTitle: "Country",
          message: "invalid country",
          error: new InvalidCountry(),
        },
      ];
    },
  } satisfies AsyncFormValueValidator<
    FormValueValidatorError<typeof defaults.validator> | InvalidCountry
  >;

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
    // NOTE: the behavior of the \`$derived\` rune during SSR is different from the browser
    get disabled(): boolean {
      return BROWSER && form.submission.isProcessed;
    },
    schema,
    uiSchema,
    validator,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
`,d=`<!--
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
  import { untrack } from "svelte";

  import {
    abortPrevious,
    createAction,
    type Action,
  } from "@sjsf/form/lib/action.svelte";

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
  const searchAction: Action<[string], T[], Error> = createAction({
    execute: async (signal: AbortSignal, searchQuery: string) => {
      if (searchQuery.length < minQueryLength) {
        return [];
      }
      const promise = Promise.withResolvers<T[]>();
      const id = setTimeout(() => {
        promise.resolve(
          searchFn(signal, searchQuery).then((r) => r.slice(0, maxResults))
        );
      }, debounceMs);
      const onAbort = () => {
        clearTimeout(id);
        promise.reject(
          new DOMException("The operation was aborted.", "AbortError")
        );
      };
      signal.addEventListener("abort", onAbort);
      return promise.promise.finally(() => {
        signal.removeEventListener("abort", onAbort);
      });
    },
    combinator: abortPrevious,
    delayedMs: 150,
    timeoutMs,
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
`,m=`<script lang="ts" module>
  import type { SchemaValue } from "@sjsf/form";

  import type { Props } from "./async-combobox.svelte";

  export interface MyAsyncComboboxOptions<T extends SchemaValue>
    extends Props<T> {}

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
`,S={package:n(s),files:{"src/routes/countries.ts":l,"src/routes/+page.svelte":c,"src/routes/async-combobox.svelte":d,"src/routes/async-combobox-widget.svelte":m}};export{S as layer};
