// This file is derived from:
// https://github.com/hyperjump-io/json-schema-errors/blob/8bda546feeca780ae02c1ebd7247291424ea4a98/src/localization.js
// Copyright (c) 2026 Hyperjump Software, LLC
// Licensed under the MIT License
// Modifications made by Roman Krasilnikov.

import type { FluentBundle, FluentVariable } from "@fluent/bundle";

import type {
  Json as HyperjumpJson,
  ContainsRange,
} from "@hyperjump/json-schema-errors";

export class Localization {
  private disjunction: Intl.ListFormat;
  private conjunction: Intl.ListFormat;

  constructor(private readonly bundle: FluentBundle) {
    const locale = bundle.locales[0]!;
    this.disjunction = new Intl.ListFormat(locale, { type: "disjunction" });
    this.conjunction = new Intl.ListFormat(locale, { type: "conjunction" });
  }

  #formatMessage(messageId: string, args: Record<string, FluentVariable>) {
    const message = this.bundle.getMessage(messageId);
    if (!message?.value) {
      throw Error(`Message '${messageId}' not found.`);
    }
    return this.bundle.formatPattern(message.value, args);
  }

  getBooleanSchemaErrorMessage() {
    return this.#formatMessage("boolean-schema-message", {});
  }

  getTypeErrorMessage(expectedTypes: string[]) {
    return this.#formatMessage("type-message", {
      expectedTypes: this.disjunction.format(expectedTypes),
    });
  }

  getEnumErrorMessage(expected: HyperjumpJson[]) {
    if (expected.length === 1) {
      return this.#formatMessage("const-message", {
        expected: JSON.stringify(expected[0], null, "  "),
      });
    } else {
      const expectedJson = expected.map((value) => JSON.stringify(value));
      return this.#formatMessage("enum-message", {
        expected: this.disjunction.format(expectedJson),
      });
    }
  }

  getFormatErrorMessage(format: string) {
    return this.#formatMessage("format-message", { format });
  }

  getExclusiveMaximumErrorMessage(exclusiveMaximum: number) {
    return this.#formatMessage("exclusiveMaximum-message", {
      exclusiveMaximum,
    });
  }

  getMaximumErrorMessage(maximum: number) {
    return this.#formatMessage("maximum-message", { maximum });
  }

  getExclusiveMinimumErrorMessage(exclusiveMinimum: number) {
    return this.#formatMessage("exclusiveMinimum-message", {
      exclusiveMinimum,
    });
  }

  getMinimumErrorMessage(minimum: number) {
    return this.#formatMessage("minimum-message", { minimum });
  }

  getMultipleOfErrorMessage(multipleOf: number) {
    return this.#formatMessage("multipleOf-message", { multipleOf });
  }

  getMaxLengthErrorMessage(maxLength: number) {
    return this.#formatMessage("maxLength-message", { maxLength });
  }

  getMinLengthErrorMessage(minLength: number) {
    return this.#formatMessage("minLength-message", { minLength });
  }

  getPatternErrorMessage(pattern: number) {
    return this.#formatMessage("pattern-message", { pattern });
  }

  getMaxItemsErrorMessage(maxItems: number) {
    return this.#formatMessage("maxItems-message", { maxItems });
  }

  getMinItemsErrorMessage(minItems: number) {
    return this.#formatMessage("minItems-message", { minItems });
  }

  getContainsErrorMessage(range: ContainsRange) {
    range.minContains ??= 1;

    if (range.minContains === range.maxContains) {
      return this.#formatMessage("contains-exact-message", range);
    } else if (range.maxContains) {
      return this.#formatMessage("contains-range-message", range);
    } else {
      return this.#formatMessage("contains-message", range);
    }
  }

  getUniqueItemsErrorMessage() {
    return this.#formatMessage("uniqueItems-message", {});
  }

  getMaxPropertiesErrorMessage(maxProperties: number) {
    return this.#formatMessage("maxProperties-message", { maxProperties });
  }

  getMinPropertiesErrorMessage(minProperties: number) {
    return this.#formatMessage("minProperties-message", { minProperties });
  }

  getRequiredErrorMessage(required: string[]) {
    return this.#formatMessage("required-message", {
      required: this.conjunction.format(required),
      count: required.length,
    });
  }

  getAnyOfErrorMessage() {
    return this.#formatMessage("anyOf-message", {});
  }

  getOneOfErrorMessage(matchCount: number) {
    return this.#formatMessage("oneOf-message", { matchCount });
  }

  getNotErrorMessage() {
    return this.#formatMessage("not-message", {});
  }

  getUnknownErrorMessage(keyword: string) {
    return this.#formatMessage("unknown-message", { keyword });
  }
}
