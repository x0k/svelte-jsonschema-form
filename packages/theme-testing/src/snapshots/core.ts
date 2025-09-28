import type { Component } from "svelte";
import { expect, test } from "vitest";
import { render } from "vitest-browser-svelte";
import { DEFAULT_ID_PREFIX, type FormOptions } from "@sjsf/form";

import * as defaults from "../components/form-defaults.js";
import DefaultForm from "./form.svelte";

export const idBuilder = defaults.createIdBuilder({
  idPrefix: DEFAULT_ID_PREFIX,
});

type Defaults = keyof typeof defaults;

export type SnapshotFormOptions = Omit<FormOptions<any>, Defaults> &
  Partial<Pick<FormOptions<any>, Defaults>>;

export type TestForm = Component<FormOptions<any>>;

export interface MatchSnapshotOptions {
  defaultFormOptions?: Partial<FormOptions<any>>;
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
