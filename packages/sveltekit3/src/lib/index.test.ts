import { describe, expect, it } from "vitest";

import * as formActions from "./client/index.js";
import * as root from "./index.js";
import * as rfClient from "./rf/client/index.js";
import * as rf from "./rf/index.js";
import * as rfServer from "./rf/server/index.js";
import * as formActionsServer from "./server/index.js";

/**
 * The package root and the documented subpaths are what consumers import, so a
 * subpath that stops resolving shows up here rather than at their build.
 */
const SUBPATHS = {
  ".": root,
  "./client": formActions,
  "./server": formActionsServer,
  "./rf": rf,
  "./rf/client": rfClient,
  "./rf/server": rfServer,
} as const;

describe("package entry points", () => {
  it.each(Object.keys(SUBPATHS))(
    "%s resolves and exports something",
    (subpath) => {
      const mod = SUBPATHS[subpath as keyof typeof SUBPATHS];

      expect(Object.keys(mod).length).toBeGreaterThan(0);
    }
  );

  it("root re-exports the id builder and the form-data keys", () => {
    expect(root.createFormIdBuilder).toBeTypeOf("function");
    expect(root.JSON_CHUNKS_KEY).toBe("__sjsf_sveltekit_json_chunks");
    expect(root.FORM_DATA_FILE_PREFIX).toBe("__sjsf_sveltekit_file__");
  });

  it("the remote-functions subpaths expose the connect/validate pair", () => {
    expect(rfClient.connect).toBeTypeOf("function");
    expect(rfServer.createServerValidator).toBeTypeOf("function");
    expect(rfClient.getRemoteFormFieldId).toBeTypeOf("function");
  });
});
