import { add, type AddonMap } from "sv";
import fs from "node:fs";
import path from "node:path";
import { beforeEach, inject, TestAPI, test as vitestTest } from "vitest";
import type { AddonTestCase, Fixtures, SetupTestOptions } from "sv/testing";

export function setupSnapshotTest<Addons extends AddonMap>(
  addons: Addons,
  options?: Omit<SetupTestOptions<Addons>, "browser">,
) {
  const test = vitestTest.extend({}) as unknown as TestAPI<
    Pick<Fixtures, "cwd">
  >;

  const testDir = inject("testDir");
  const templatesDir = inject("templatesDir");
  const variants = inject("variants");

  const testCases: Array<AddonTestCase<Addons>> = [];
  for (const kind of options?.kinds ?? []) {
    for (const variant of variants) {
      const tc = { variant, kind };
      if (!options?.filter || options.filter(tc)) testCases.push(tc);
    }
  }

  let testName: string;

  test.beforeAll(async (_ctx, suite) => {
    testName = path.dirname(suite.file.filepath).split("/").at(-1)!;
    const testRoot = path.resolve(testDir, testName);

    fs.rmSync(testRoot, { recursive: true, force: true });
    fs.mkdirSync(testRoot, { recursive: true });

    for (const { variant, kind } of testCases) {
      const targetDir = path.resolve(testRoot, `${kind.type}-${variant}`);

      fs.cpSync(path.resolve(templatesDir, variant), targetDir, {
        recursive: true,
        force: true,
      });

      await add({
        cwd: targetDir,
        addons,
        options: kind.options,
        packageManager: "pnpm",
      });
    }
  });

  beforeEach<Pick<Fixtures, "cwd">>(async (ctx) => {
    ctx.cwd = (tc) =>
      path.resolve(testDir, testName, `${tc.kind.type}-${tc.variant}`);
  });

  return { test, testCases };
}
