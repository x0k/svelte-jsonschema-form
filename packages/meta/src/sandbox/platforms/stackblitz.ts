import sdk from "@stackblitz/sdk";

import { INITIAL_FILE, type SandboxOptions } from "../model.ts";

export default function ({ name, files }: SandboxOptions) {
  (sdk as unknown as typeof sdk.default).openProject(
    {
      title: name,
      files,
      template: "node",
    },
    {
      openFile: INITIAL_FILE,
    },
  );
}
