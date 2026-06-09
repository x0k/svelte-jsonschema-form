import { zipSync } from "fflate";

import { normalizeProjectName } from "../../composer/composer.ts";
import type { SandboxOptions } from "../model.ts";

export default function ({ name, files }: SandboxOptions) {
  const zipData: Record<string, Uint8Array> = {};
  for (const [path, content] of Object.entries(files)) {
    zipData[path] = new TextEncoder().encode(content);
  }
  const zipped = zipSync(zipData, { level: 0 });
  const blob = new Blob([zipped], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${normalizeProjectName(name)}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
