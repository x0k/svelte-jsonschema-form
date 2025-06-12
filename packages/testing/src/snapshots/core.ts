import type { Component } from "svelte";
import { expect, test } from "vitest";
import { render } from "vitest-browser-svelte";
import type { FormOptions, Validator } from "@sjsf/form";

import * as defaults from "../components/form-defaults";
import DefaultForm from "./form.svelte";

type Defaults = keyof typeof defaults;

export type SnapshotFormOptions = Omit<FormOptions<any, Validator>, Defaults> &
  Partial<Pick<FormOptions<any, any>, Defaults>>;

export type TestForm = Component<FormOptions<any, Validator>>;

export interface MatchSnapshotOptions {
  defaultFormOptions?: Partial<FormOptions<any, Validator>>;
  context?: Map<any, any>;
  Form?: TestForm;
}

export function matchSnapshot(
  formOptions: SnapshotFormOptions,
  { context, defaultFormOptions, Form = DefaultForm }: MatchSnapshotOptions = {}
) {
  const { container } = render(Form, {
    target: document.body.appendChild(document.createElement("div")),
    context,
    props: {
      ...defaults,
      ...defaultFormOptions,
      ...formOptions,
    },
  });
  expect(container).toMatchSnapshot();
}

export function testMatchSnapshot(
  title: string,
  formOptions: SnapshotFormOptions,
  matchOptions?: MatchSnapshotOptions
) {
  test(title, () => {
    matchSnapshot(formOptions, matchOptions);
  });
}
