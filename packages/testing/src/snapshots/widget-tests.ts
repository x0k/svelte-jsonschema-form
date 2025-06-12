import {
  type FormOptions,
  type Schema,
  type Theme,
  type UiSchemaRoot,
  type Validator,
  pathToId,
  SimpleForm,
} from "@sjsf/form";
import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-svelte";

import * as defaults from "../components/form-defaults";
import { DEFAULT_SPECS, type s } from "../demo";

type Defaults = keyof typeof defaults | "theme";

type SnapshotFormOptions<T, V extends Validator> = Omit<
  FormOptions<T, V>,
  Defaults
> &
  Partial<Pick<FormOptions<T, V>, Defaults>>;

export function widgetTests(
  theme: Theme,
  additionalSpecs: s.Specs,
  context?: Map<any, any>
) {
  function testSnapshot(
    title: string,
    options: SnapshotFormOptions<any, Validator>
  ) {
    test(title, () => {
      const { container } = render(SimpleForm, {
        target: document.body.appendChild(document.createElement("div")),
        context,
        props: {
          ...defaults,
          ...options,
          theme,
        },
      });
      expect(container).toMatchSnapshot();
    });
  }

  function testWidget(widget: string, schema: Schema, uiSchema: UiSchemaRoot) {
    describe(widget, () => {
      testSnapshot("normal", { schema, uiSchema });
      testSnapshot("error", {
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
      testSnapshot("readonly", {
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
