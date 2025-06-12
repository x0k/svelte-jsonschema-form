import type { Component } from "svelte";
import { expect, test } from "vitest";
import { render } from "vitest-browser-svelte";
import { type FormOptions, type Validator } from "@sjsf/form";

import * as defaults from "../components/form-defaults";
import DefaultForm from "./form.svelte";

type Defaults = keyof typeof defaults;

export type SnapshotFormOptions = Omit<FormOptions<any, Validator>, Defaults> &
  Partial<Pick<FormOptions<any, any>, Defaults>>;

export type TestForm = Component<FormOptions<any, Validator>>;

export interface MatchSnapshotOptions {
  context?: Map<any, any>;
  Form?: TestForm;
}

export function matchSnapshot(
  formOptions: SnapshotFormOptions,
  { context, Form = DefaultForm }: MatchSnapshotOptions = {}
) {
  const { container } = render(Form, {
    target: document.body.appendChild(document.createElement("div")),
    context,
    props: {
      ...defaults,
      ...formOptions,
    },
  });
  expect(container).toMatchSnapshot();
}

export function testSnapshot(
  title: string,
  options: SnapshotFormOptions,
  matchOptions?: MatchSnapshotOptions
) {
  test(title, () => {
    matchSnapshot(options, matchOptions);
  });
}
