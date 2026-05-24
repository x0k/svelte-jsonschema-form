import sdk from "@stackblitz/sdk";

import { INITIAL_FILE, type OpenPlatformProject } from "../project.ts";

const openProject: OpenPlatformProject = (
  { example, theme, validator },
  files,
) =>
  (sdk as unknown as typeof sdk.default).openProject(
    {
      title: `${example} (${theme}, ${validator})`,
      files,
      template: "node",
    },
    {
      openFile: INITIAL_FILE,
    },
  );

export default openProject;
