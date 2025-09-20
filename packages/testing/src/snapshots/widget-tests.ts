import { describe, expect, test } from "vitest";
import {
  type FieldValueValidator,
  type Theme,
  type Validator,
  idFromPath,
} from "@sjsf/form";

import { render } from "vitest-browser-svelte";

import * as defaults from "../components/form-defaults.js";
import { s } from "../demo/index.js";
import {
  testMatchSnapshot,
  type MatchSnapshotOptions,
  type SnapshotFormOptions,
} from "./core.js";
import Form from "./form.svelte";

const ERROR_TEXT = "field_error";

export function widgetTests(
  theme: Theme,
  specs: s.Specs,
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

  function testWidget(
    widget: string,
    [schema, uiSchema, validationTriggers]: s.Specs[string]
  ) {
    describe(widget, () => {
      describe("snapshots", () => {
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
      for (const mode of s.FIELD_VALIDATION_MODES) {
        const modeName = s.FIELD_VALIDATION_MODE_NAMES[mode]!;
        const trigger = validationTriggers[modeName];
        if (trigger) {
          test(`${widget} ${modeName} validation mode`, async () => {
            const screen = render(Form, {
              target: document.body.appendChild(document.createElement("div")),
              props: {
                ...defaults,
                theme,
                schema,
                uiSchema,
                fieldsValidationMode: mode,
                createValidator: (options) =>
                  ({
                    ...defaults.createValidator(options),
                    validateFieldValue(cfg) {
                      return [
                        {
                          instanceId: cfg.id,
                          propertyTitle: cfg.title,
                          message: ERROR_TEXT,
                          error: null,
                        },
                      ];
                    },
                  }) satisfies Validator & FieldValueValidator<any>,
              },
            });
            await trigger(screen.locator);
            const err = screen.getByText(ERROR_TEXT);
            await expect.element(err).toBeInTheDocument();
          });
        }
      }
    });
  }

  describe("widgets", () => {
    for (const [key, data] of Object.entries(specs)) {
      testWidget(key, data);
    }
  });
}
