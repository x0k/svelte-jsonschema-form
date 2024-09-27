import arrays from "./arrays";
import anyOf from "./anyOf";
import oneOf from "./oneOf";
import allOf from "./allOf";
import enumObjects from "./enumObjects";
import nested from "./nested";
import numbers from "./numbers";
import simple from "./simple";
// import widgets from './widgets';
import ordering from "./ordering";
import references from "./references";
import custom from "./custom";
import errors from "./errors";
import examples from "./examples";
import large from "./large";
import date from "./date";
import validation from "./validation";
import files from "./files";
import single from "./single";
// import customArray from './customArray';
// import customFieldAnyOf from './customFieldAnyOf';
// import customObject from './customObject';
import alternatives from "./alternatives";
import propertyDependencies from "./propertyDependencies";
import schemaDependencies from "./schemaDependencies";
import additionalProperties from "./additionalProperties";
import nullable from "./nullable";
import nullField from "./null";
import errorSchema from "./errorSchema";
import defaults from "./defaults";
import options from "./options";
import ifThenElse from "./ifThenElse";
import customField from "./customField";
import type { Sample } from "./Sample";

const skipped: Sample = {
  status: "skipped",
  schema: {},
  uiSchema: {},
  formData: {},
};

export const samples = Object.freeze({
  Blank: { status: "prefect", schema: {}, uiSchema: {}, formData: {} },
  Simple: simple,
  "UI Options": options,
  Nested: nested,
  Arrays: arrays,
  Numbers: numbers,
  Widgets: skipped, //widgets,
  Ordering: ordering,
  References: references,
  Custom: custom,
  Errors: errors,
  Examples: examples,
  Large: large,
  "Date & time": date,
  Validation: validation,
  Files: files,
  Single: single,
  "Custom Array": skipped, //customArray,
  "Custom Object": skipped, //customObject,
  Alternatives: alternatives,
  "Property dependencies": propertyDependencies,
  "Schema dependencies": schemaDependencies,
  "Additional Properties": additionalProperties,
  "Any Of": anyOf,
  "Any Of with Custom Field": skipped, // customFieldAnyOf,
  "One Of": oneOf,
  "All Of": allOf,
  "If Then Else": ifThenElse,
  "Null fields": nullField,
  "Enumerated objects": enumObjects,
  Nullable: nullable,
  ErrorSchema: errorSchema,
  Defaults: defaults,
  "Custom Field": customField,
} satisfies Record<string, Sample>);
