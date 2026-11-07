import { getValueSnapshot, setValueAtPath, type Schema } from "@sjsf/form";
import { tick } from "svelte";
import { describe, expect, test } from "vitest";

import { renderFieldForm } from "./helpers.js";

/**
 * Ports the acceptance cases of RJSF #5464, where a `dependencies` or
 * `if`/`then`/`else` swap applies the newly selected branch's default over the
 * one the swapped-away branch left in place.
 *
 * The stub case is expressed through `patternProperties` instead of
 * `additionalProperties`: a dependency branch declares no `mode`, so resolving
 * it stubs that key with the additional properties schema, and the modern
 * merger refuses the resulting type intersection. The same stub is produced
 * through a pattern, and the guard under test is unchanged.
 */

const cfgFor = (name: string): Schema => ({
  type: "object",
  default: { name },
  properties: { name: { type: "string" } },
});

function modeSwap(branchA: Schema, branchB: Schema): Schema {
  return {
    type: "object",
    properties: { mode: { type: "string", enum: ["a", "b"], default: "a" } },
    dependencies: {
      mode: {
        oneOf: [
          {
            ...branchA,
            properties: { mode: { const: "a" }, ...branchA.properties },
          },
          {
            ...branchB,
            properties: { mode: { const: "b" }, ...branchB.properties },
          },
        ],
      },
    },
  } as Schema;
}

async function renderAndSwap(schema: Schema, initialValue?: unknown) {
  const { form } = await renderFieldForm({ schema, initialValue });
  setValueAtPath(form, ["mode"], "b");
  await tick();
  return getValueSnapshot(form);
}

describe("RJSF #5464 parity", () => {
  test("object default", async () => {
    expect(
      await renderAndSwap(
        modeSwap(
          { properties: { cfg: cfgFor("a") } },
          { properties: { cfg: cfgFor("b") } }
        )
      )
    ).toEqual({ mode: "b", cfg: { name: "b" } });
  });

  test("array default", async () => {
    const numsFor = (mode: string): Schema => ({
      type: "array",
      items: { type: "number" },
      default: [mode === "a" ? 1 : 2],
    });
    expect(
      await renderAndSwap(
        modeSwap(
          { properties: { nums: numsFor("a") } },
          { properties: { nums: numsFor("b") } }
        )
      )
    ).toEqual({ mode: "b", nums: [2] });
  });

  test("type change object -> array", async () => {
    expect(
      await renderAndSwap(
        modeSwap(
          { properties: { cfg: cfgFor("a") } },
          {
            properties: {
              cfg: { type: "array", items: { type: "string" }, default: ["x"] },
            },
          }
        )
      )
    ).toEqual({ mode: "b", cfg: ["x"] });
  });

  test("retypes a leaf inside the refill", async () => {
    expect(
      await renderAndSwap(
        modeSwap(
          {
            properties: {
              cfg: {
                type: "object",
                default: { name: "a", tags: "one" },
                properties: {
                  name: { type: "string" },
                  tags: { type: "string" },
                },
              },
            },
          },
          {
            properties: {
              cfg: {
                type: "object",
                default: { name: "b", tags: ["x"] },
                properties: {
                  name: { type: "string" },
                  tags: { type: "array", items: { type: "string" } },
                },
              },
            },
          }
        )
      )
    ).toEqual({ mode: "b", cfg: { name: "b", tags: ["x"] } });
  });

  test("retypes its only leaf", async () => {
    expect(
      await renderAndSwap(
        modeSwap(
          {
            properties: {
              cfg: {
                type: "object",
                default: { v: "x" },
                properties: { v: { type: "string" } },
              },
            },
          },
          {
            properties: {
              cfg: {
                type: "object",
                default: { v: 5 },
                properties: { v: { type: "number" } },
              },
            },
          }
        )
      )
    ).toEqual({ mode: "b", cfg: { v: 5 } });
  });

  test("new branch declares through its own default object", async () => {
    const schema = {
      type: "object",
      properties: {
        mode: { type: "string", enum: ["a", "b"], default: "a" },
        cfg: { type: "object", properties: { name: { type: "string" } } },
      },
      if: { properties: { mode: { const: "a" } } },
      then: { default: { cfg: { name: "a" } } },
      else: { default: { cfg: { name: "b" } } },
    } as Schema;
    expect(await renderAndSwap(schema)).toEqual({
      mode: "b",
      cfg: { name: "b" },
    });
  });

  test("anyOf selects no properties", async () => {
    const schema = {
      type: "object",
      properties: {
        mode: { type: "string", enum: ["a", "b"], default: "a" },
        other: { type: "string" },
      },
      if: { properties: { mode: { const: "a" } } },
      then: { properties: { cfg: cfgFor("a") } },
      else: { properties: { cfg: cfgFor("b") } },
      anyOf: [{ required: ["mode"] }, { required: ["other"] }],
    } as Schema;
    expect(await renderAndSwap(schema)).toEqual({
      mode: "b",
      cfg: { name: "b" },
    });
  });

  test("nested branch default under a oneOf that declares properties", async () => {
    const dietFor = (food: string): Schema => ({
      type: "object",
      default: { food },
      properties: { food: { type: "string" } },
    });
    const schema = {
      type: "object",
      properties: {
        m: {
          type: "object",
          properties: {
            animal: { type: "string", enum: ["Cat", "Fish"], default: "Fish" },
          },
          dependencies: {
            animal: {
              oneOf: [
                {
                  properties: {
                    animal: { const: "Cat" },
                    diet: dietFor("meat"),
                  },
                },
                {
                  properties: {
                    animal: { const: "Fish" },
                    diet: dietFor("worms"),
                  },
                },
              ],
            },
          },
        },
      },
      oneOf: [
        { title: "A", properties: { x: { type: "string" } } },
        { title: "B", properties: { y: { type: "string" } } },
      ],
    } as Schema;
    const { form } = await renderFieldForm({ schema });
    setValueAtPath(form, ["m", "animal"], "Cat");
    await tick();
    expect(getValueSnapshot(form)).toEqual({
      m: { animal: "Cat", diet: { food: "meat" } },
    });
  });

  test("puts the old value back where dropping collapses the branch", async () => {
    const schema = {
      type: "object",
      properties: {
        mode: { type: "string", enum: ["a", "b"], default: "a" },
        cfg: { type: "object", properties: { name: { type: "string" } } },
      },
      allOf: [
        {
          if: {
            properties: { mode: { const: "a" } },
            required: ["mode", "cfg"],
          },
          then: { properties: { cfg: cfgFor("a") } },
        },
        {
          if: {
            properties: { mode: { const: "b" } },
            required: ["mode", "cfg"],
          },
          then: { properties: { cfg: cfgFor("b") } },
        },
      ],
    } as Schema;
    expect(
      await renderAndSwap(schema, { mode: "a", cfg: { name: "a" } })
    ).toEqual({
      mode: "b",
      cfg: { name: "a" },
    });
  });

  test("keeps a sibling the dropped key's own dependency declares", async () => {
    const withCfg = (name: string): Schema => ({
      dependencies: {
        cfg: { properties: { cfg: cfgFor(name), extra: { type: "string" } } },
      },
    });
    const schema = {
      type: "object",
      properties: { mode: { type: "string", enum: ["a", "b"], default: "a" } },
      if: { properties: { mode: { const: "a" } } },
      then: withCfg("a"),
      else: withCfg("b"),
    } as Schema;
    expect(
      await renderAndSwap(schema, {
        mode: "a",
        cfg: { name: "a" },
        extra: "user text",
      })
    ).toEqual({
      mode: "b",
      extra: "user text",
      cfg: { name: "a" },
    });
  });

  test("applies a default that replacing another key brings into reach", async () => {
    const optsFor = (o: string): Schema => ({
      type: "object",
      default: { o },
      properties: { o: { type: "string" } },
    });
    const kindFor = (k: string): Schema => ({
      type: "string",
      enum: ["k1", "k2"],
      default: k,
    });
    const schema = {
      type: "object",
      properties: { mode: { type: "string", enum: ["a", "b"], default: "a" } },
      allOf: [
        {
          if: { properties: { mode: { const: "a" } } },
          then: { properties: { kind: kindFor("k1") } },
          else: { properties: { kind: kindFor("k2") } },
        },
        {
          if: { properties: { kind: { const: "k1" } } },
          then: { properties: { opts: optsFor("k1") } },
          else: { properties: { opts: optsFor("k2") } },
        },
      ],
    } as Schema;
    expect(await renderAndSwap(schema)).toEqual({
      mode: "b",
      kind: "k2",
      opts: { o: "k2" },
    });
  });

  test("resolves a replacement's own conditionals against the value written for it", async () => {
    const petFor = (branch: string): Schema => ({
      type: "object",
      default: { animal: "Fish" },
      properties: { animal: { type: "string", enum: ["Cat", "Fish"] } },
      if: { properties: { animal: { const: "Cat" } } },
      then: {
        properties: { diet: { type: "string", default: `${branch} meat` } },
      },
      else: {
        properties: { tank: { type: "string", default: `${branch} tank` } },
        required: ["tank"],
      },
    });
    const schema = {
      type: "object",
      properties: { mode: { type: "string", enum: ["a", "b"], default: "a" } },
      if: { properties: { mode: { const: "a" } } },
      then: { properties: { pet: petFor("a") } },
      else: { properties: { pet: petFor("b") } },
    } as Schema;
    expect(await renderAndSwap(schema)).toMatchObject({
      mode: "b",
      pet: { animal: "Fish", tank: "b tank" },
    });
  });

  test("keeps a value under a stubbed additional property", async () => {
    const extraFor = (tag: string): Schema => ({
      type: "object",
      default: { tag },
      properties: { tag: { type: "string" } },
    });
    // The branches describe `extra` through `patternProperties` so that
    // `mode`, which the dependency resolution leaves undeclared in the branch,
    // stubs to its own value's type instead of the additional properties
    // schema. The value under test is still held only because the data has it,
    // which is what makes it a stub.
    const branchFor = (tag: string): Schema => ({
      patternProperties: { "^extra$": extraFor(tag) },
      additionalProperties: true,
    });
    const schema = modeSwap(branchFor("a"), branchFor("b"));
    expect(
      await renderAndSwap(schema, { mode: "a", extra: { tag: "a" } })
    ).toEqual({
      mode: "b",
      extra: { tag: "a" },
    });
  });

  test("nested dependency two object levels down", async () => {
    const animalSchema = {
      type: "object",
      properties: {
        animal: { type: "string", enum: ["Cat", "Fish"], default: "Fish" },
      },
      dependencies: {
        animal: {
          oneOf: [
            {
              properties: {
                animal: { const: "Cat" },
                diet: {
                  type: "object",
                  default: { food: "meat" },
                  properties: { food: { type: "string" } },
                },
              },
            },
            {
              properties: {
                animal: { const: "Fish" },
                diet: {
                  type: "object",
                  default: { food: "worms" },
                  properties: { food: { type: "string" } },
                },
              },
            },
          ],
        },
      },
    } as Schema;
    const schema = {
      type: "object",
      properties: {
        outer: { type: "object", properties: { m: animalSchema } },
      },
    } as Schema;
    const { form } = await renderFieldForm({ schema });
    setValueAtPath(form, ["outer", "m", "animal"], "Cat");
    await tick();
    expect(getValueSnapshot(form)).toEqual({
      outer: { m: { animal: "Cat", diet: { food: "meat" } } },
    });
  });
});
