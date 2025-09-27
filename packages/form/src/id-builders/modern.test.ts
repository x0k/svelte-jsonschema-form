import { beforeEach, describe, expect, test } from "vitest";

import type { Path } from "@/core/path.js";
import type { FormIdBuilder } from "@/form/main.js";

import { createFormIdBuilder } from "./modern.js";

describe("createFormIdBuilder", () => {
  let idBuilder: FormIdBuilder;

  beforeEach(() => {
    idBuilder = createFormIdBuilder();
  });

  test("toPath === fromPath", () => {
    const path: Path = ["foo", 0, 0, "bar", "bar", 0];
    let id = idBuilder.fromPath(path);
    id = idBuilder.pseudoId(id, "key-input");
    expect(idBuilder.toPath(id)).toEqual(path);
  });
});
