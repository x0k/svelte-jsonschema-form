import { beforeEach, describe, expect, test } from "vitest";

import type { Path } from "@/core/path.js";
import { encodePseudoElement, type FormIdBuilder } from "@/form/main.js";

import { createFormIdBuilder } from "./modern.js";

describe("createFormIdBuilder", () => {
  let idBuilder: FormIdBuilder;

  beforeEach(() => {
    idBuilder = createFormIdBuilder();
  });

  test("toPath === fromPath", () => {
    const path: Path = [
      "foo",
      0,
      0,
      "bar",
      "bar",
      0,
      encodePseudoElement("key-input"),
    ];
    const id = idBuilder.fromPath(path);
    expect(idBuilder.toPath(id)).toEqual(path);
  });
});
