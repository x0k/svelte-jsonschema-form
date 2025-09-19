import { describe } from "vitest";
import {
  type Schema,
  type Theme,
  type UiSchemaRoot,
  idFromPath,
} from "@sjsf/form";

import { DEFAULT_SPECS, type s } from "../demo";

import {
  testMatchSnapshot,
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
    testMatchSnapshot(
      state,
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
            instanceId: idFromPath([]),
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
    const specs = {
      ...DEFAULT_SPECS,
      ...additionalSpecs,
    };
    for (const [key, [schema, uiSchema]] of Object.entries(specs)) {
      testWidget(key, schema, uiSchema);
    }
  });
}
