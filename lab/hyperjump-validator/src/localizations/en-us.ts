// This file is derived from:
// https://github.com/hyperjump-io/json-schema-errors/blob/8bda546feeca780ae02c1ebd7247291424ea4a98/src/translations/en-US.ftl
// Copyright (c) 2026 Hyperjump Software, LLC
// Licensed under the MIT License
// Modifications made by Roman Krasilnikov.

import { FluentBundle, FluentResource } from "@fluent/bundle";

import { Localization } from "../localization.js";

const source = `// Any type keywords
boolean-schema-message = A value is not allowed here
type-message = Expected a {$expectedTypes}
const-message = Expected exactly {$expected}
enum-message = Expected one of {$expected}
format-message = Expected a value matching the '{$format}' format
unknown-message = Validation failed for '{$keyword}'

// Number keywords
exclusiveMaximum-message = Expected a number less than {$exclusiveMaximum}

exclusiveMinimum-message = Expected a number greater than {$exclusiveMinimum}
maximum-message = Expected a number less than or equal to {$maximum}
minimum-message = Expected a number greater than or equal to {$minimum}
multipleOf-message = Expected a number that is a multiple of {$multipleOf}

// String keywords
maxLength-message = Expected a string with no more than {$maxLength} characters
minLength-message = Expected a string with at least {$minLength} characters
pattern-message = Expected a string matching the regular expression /{$pattern}/

// Array keywords
maxItems-message = Expected an array with no more than {$maxItems} items
minItems-message = Expected an array with at least {$minItems} items
contains-message = Expected an array that contains {$minContains ->
  [1] at least one item matching
 *[other] at least {$minContains} items matching
} the 'contains' schema
contains-range-message = Expected an array containing between {$minContains} and {$maxContains} items matching the 'contains' schema
contains-exact-message = Expected an array containing {$minContains ->
  [1] exactly one item matching
 *[other] exactly {$minContains} items matching
} the 'contains' schema
uniqueItems-message = Array items must be unique

// Object keywords
maxProperties-message = Expected an object with no more than {$maxProperties} properties
minProperties-message = Expected an object with at least {$minProperties} properties
required-message = Missing required {$count ->
  [one] property: {$required}
 *[other] properties: {$required}
}

// Applicators
anyOf-message = Expected the value to match at least one alternative
oneOf-message = Expected the value to match exactly one alternative, {$matchCount ->
  [0] but none
 *[other] but more than one
} matched
not-message = Expected a value that doesn't match the 'not' schema
`;

const resource = new FluentResource(source);
const bundle = new FluentBundle("en-US");
bundle.addResource(resource);

export const localization = new Localization(bundle);
