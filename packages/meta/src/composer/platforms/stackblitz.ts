import sdk from "@stackblitz/sdk";

import { INITIAL_FILE, type OpenPlatformProject } from "../project.ts";

const openProject: OpenPlatformProject = ({ name, theme, validator }, files) =>
  (sdk as unknown as typeof sdk.default).openProject(
    {
      title: `${name} (${theme}, ${validator})`,
      files,
      template: "node",
    },
    {
      openFile: INITIAL_FILE,
    },
  );

export default openProject;
