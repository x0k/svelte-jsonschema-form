import { describe, test } from "vitest";
import {
  type Schema,
  type Theme,
  type UiSchemaRoot,
  pathToId,
} from "@sjsf/form";

import { DEFAULT_SPECS, type s } from "../demo";

import {
  matchSnapshot,
  type MatchSnapshotOptions,
  type SnapshotFormOptions,
} from "./core";

export function widgetTests(
  theme: Theme,
  additionalSpecs: s.Specs,
  matchOptions?: MatchSnapshotOptions
) {
  const snapshot = (
    state: string,
    options: Omit<SnapshotFormOptions, "theme">
  ) =>
    matchSnapshot(
      state,
      {
        ...options,
        theme,
      },
      matchOptions
    );

  function testWidget(widget: string, schema: Schema, uiSchema: UiSchemaRoot) {
    test(widget, () => {
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

  describe("widgets", () => {
    for (const [key, [schema, uiSchema]] of Object.entries(
      Object.assign(DEFAULT_SPECS, additionalSpecs)
    )) {
      testWidget(key, schema, uiSchema);
    }
  });
}
