import { sandboxOpen, type SandboxPlatform } from "../sandbox/index.ts";

import { createExampleFiles, type CreateExampleFilesOptions } from "./model.ts";

export interface OpenExampleOptions extends CreateExampleFilesOptions {
  platform: SandboxPlatform;
}

export async function openExample(options: OpenExampleOptions) {
  const files = await createExampleFiles(options);
  await sandboxOpen({
    name: options.example,
    platform: options.platform,
    files,
  });
}
