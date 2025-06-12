import { describe } from "vitest";
import {
  type Schema,
  type Theme,
  type UiSchemaRoot,
  pathToId,
} from "@sjsf/form";

import { DEFAULT_SPECS, type s } from "../demo";

import {
  testSnapshot,
  type MatchSnapshotOptions,
  type SnapshotFormOptions,
} from "./core";

export function widgetTests(
  theme: Theme,
  additionalSpecs: s.Specs,
  matchOptions?: MatchSnapshotOptions
) {
  const snapshot = (
    title: string,
    options: Omit<SnapshotFormOptions, "theme">
  ) =>
    testSnapshot(
      title,
      {
        ...options,
        theme,
      },
      matchOptions
    );

  function testWidget(widget: string, schema: Schema, uiSchema: UiSchemaRoot) {
    describe(widget, () => {
      snapshot("normal", { schema, uiSchema });
      snapshot("error", {
        schema,
        uiSchema,
        initialErrors: [
          {
            error: null as any,
            instanceId: pathToId([]),
            propertyTitle: "title",
            message: "error",
          },
        ],
      });
      snapshot("disabled", {
        schema,
        uiSchema,
        disabled: true,
      });
      snapshot("readonly", {
        schema: Object.assign({ readOnly: true }, schema),
        uiSchema,
      });
    });
  }

  for (const [key, [schema, uiSchema]] of Object.entries(
    Object.assign(DEFAULT_SPECS, additionalSpecs)
  )) {
    testWidget(key, schema, uiSchema);
  }
}
