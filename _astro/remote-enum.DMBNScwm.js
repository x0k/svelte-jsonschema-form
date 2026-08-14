import{r as e}from"./rolldown-runtime.C0FnF6B9.js";import{a as t,i as n,n as r,r as i}from"./model.BHx2IYJR.js";var a=`<script lang="ts" module>
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
`,o=`<script lang="ts" module>
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
`,s=`export const COUNTRIES = [
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
`,c=e({default:()=>u,meta:()=>l}),l=t({category:r.LogicExtension,title:`Remote Enum`,description:`Async enum options loaded from a remote source.`,tags:[i.Enum]}),u=n({files:{"src/routes/countries.ts":s,"src/routes/+page.svelte":a,"src/routes/async-combobox.svelte":o}});export{c as n,l as t};