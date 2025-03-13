import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const packageJsonPath = join(process.cwd(), "package.json");

if (!existsSync(packageJsonPath)) {
  throw new Error(`File "${packageJsonPath}" not found`);
}

const packageJsonContent = JSON.parse(
  readFileSync(packageJsonPath, "utf-8").toString()
);

if (typeof packageJsonContent !== "object") {
  throw new Error(`Failed to parse package.json content`);
}

const dotTypesExport = packageJsonContent.exports?.["."]?.types;

if (typeof dotTypesExport !== "string") {
  throw new Error("Root types export not found");
}

const typesFilePath = join(process.cwd(), dotTypesExport);

if (!existsSync(typesFilePath)) {
  throw new Error("Theme types file not found");
}

const typesFileContent = readFileSync(typesFilePath, "utf-8").toString();

const target = "never";
const replacement =
  'keyof import("@sjsf/form/fields/resolver/definitions").ExtraFields';

const matchesCount = typesFileContent.match(new RegExp(target, "g"))?.length;

if (matchesCount !== 1) {
  throw new Error(
    `Failed to find replacement target, invalid amount of matches: "${matchesCount}", expected: "1"`
  );
}

const newTypesFileContent = typesFileContent.replace(target, replacement);

writeFileSync(typesFilePath, newTypesFileContent);

console.log("Theme resolver type patched successfully!");
