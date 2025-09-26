import { render } from "vitest-browser-svelte";
import { describe, expect, test } from "vitest";
import { isRecordEmpty } from "@sjsf/form/lib/object";
import {
  type FieldValueValidator,
  type Theme,
  type Validator,
} from "@sjsf/form";

import * as defaults from "../components/form-defaults.js";
import * as triggers from "../demo/triggers.js";
import { s } from "../demo/index.js";
import {
  idBuilder,
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
              instanceId: idBuilder.fromPath([]),
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
      if (!isRecordEmpty(validationTriggers)) {
        describe(`${widget}: validations mode`, () => {
          for (const mode of s.FIELD_VALIDATION_MODES) {
            const modeName = s.FIELD_VALIDATION_MODE_NAMES[mode]!;
            const trigger = validationTriggers[modeName];
            if (trigger) {
              test(`${widget}: ${modeName}`, async () => {
                const rootDiv = document.createElement("div");
                rootDiv.dataset["testid"] = "root-element";
                const screen = render(matchOptions?.Form ?? Form, {
                  target: document.body.appendChild(rootDiv),
                  context: matchOptions?.context,
                  props: {
                    ...defaults,
                    ...matchOptions?.defaultFormOptions,
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
                await triggers[trigger](screen.locator);
                const err = screen.getByText(ERROR_TEXT);
                await expect.element(err).toBeInTheDocument();
              });
            }
          }
        });
      }
    });
  }

  describe("widgets", () => {
    for (const [key, data] of Object.entries(specs)) {
      testWidget(key, data);
    }
  });
}
