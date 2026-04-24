// This file is derived from:
// https://github.com/hyperjump-io/json-schema-errors/blob/8bda546feeca780ae02c1ebd7247291424ea4a98/src/output-plugin.js
// Copyright (c) 2026 Hyperjump Software, LLC
// Licensed under the MIT License
// Modifications made by Roman Krasilnikov.

import type { NormalizedOutput } from "@hyperjump/json-schema-errors";
import type {
  EvaluationPlugin,
  Keyword,
  Node,
  ValidationContext,
} from "@hyperjump/json-schema/experimental";
import * as Instance from "@hyperjump/json-schema/instance/experimental";

type ErrorsContext = ValidationContext & {
  output: NormalizedOutput;
  subSchemaOutput?: NormalizedOutput[];
};

export class JsonSchemaErrorsOutputPlugin implements EvaluationPlugin<ErrorsContext> {
  public output: NormalizedOutput;
  constructor() {
    this.output = {};
  }

  beforeSchema(
    _url: string,
    _instance: Instance.JsonNode,
    context: ErrorsContext,
  ): void {
    context.output = {};
  }

  beforeKeyword(
    _keywordNode: Node<unknown>,
    _instance: Instance.JsonNode,
    context: ErrorsContext,
    schemaContext: ErrorsContext,
    _keyword: Keyword<unknown>,
  ): void {
    context.output = schemaContext.output;
  }

  afterKeyword(
    keywordNode: Node<unknown>,
    instance: Instance.JsonNode,
    context: ErrorsContext,
    valid: boolean,
    schemaContext: ErrorsContext,
    keyword: Keyword<unknown>,
  ): void {
    const [keywordUri, schemaLocation] = keywordNode;

    if (keyword.simpleApplicator) {
      for (const subSchemaOutput of context.subSchemaOutput ?? []) {
        mergeOutput(schemaContext.output, subSchemaOutput);
      }
    } else {
      schemaContext.output[Instance.uri(instance)] ??= {};
      schemaContext.output[Instance.uri(instance)]![keywordUri] ??= {};
      schemaContext.output[Instance.uri(instance)]![keywordUri]![
        schemaLocation
      ] = valid || (context.subSchemaOutput ?? valid);
    }
  }

  afterSchema(
    url: string,
    instance: Instance.JsonNode,
    context: ErrorsContext,
    valid: boolean,
  ): void {
    if (typeof context.ast[url] === "boolean" && !valid) {
      context.output[Instance.uri(instance)] ??= {};
      context.output[Instance.uri(instance)]![
        "https://json-schema.org/validation"
      ] ??= {};
      context.output[Instance.uri(instance)]![
        "https://json-schema.org/validation"
      ]![url] = valid;
    }

    context.subSchemaOutput ??= [];
    context.subSchemaOutput.push(context.output);

    this.output = context.output;
  }
}

const mergeOutput = (a: NormalizedOutput, b: NormalizedOutput) => {
  for (const instanceLocation in b) {
    a[instanceLocation] ??= {};
    for (const keywordUri in b[instanceLocation]) {
      a[instanceLocation][keywordUri] ??= {};

      Object.assign(
        a[instanceLocation][keywordUri],
        b[instanceLocation][keywordUri],
      );
    }
  }
};
