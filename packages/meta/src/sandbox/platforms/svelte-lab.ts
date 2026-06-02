import type { DirectoryNode, FileSystemTree } from "@webcontainer/api";
import lz from "lz-string";

import type { SandboxOptions } from "../model.ts";

export default function ({ files }: SandboxOptions) {
  const encoded = lz.compressToEncodedURIComponent(
    JSON.stringify(convertToFileSystemTree(files)),
  );
  const params = new URLSearchParams([["code", encoded]]);
  const url = `https://www.sveltelab.dev/#${params.toString()}`;
  window.open(url);
}

function convertToFileSystemTree(
  flatFiles: Record<string, string>,
): FileSystemTree {
  const tree: FileSystemTree = {};

  for (const [path, content] of Object.entries(flatFiles)) {
    const parts = path.split("/");
    let current = tree;
    for (let i = 0; i < parts.length - 1; i++) {
      const dirName = parts[i]!;
      let dir: FileSystemTree[string] | undefined = current[dirName];
      if (dir === undefined || !("directory" in dir)) {
        dir = {
          directory: {},
        } satisfies DirectoryNode;
        current[dirName] = dir;
      }
      current = dir.directory!;
    }
    const fileName = parts[parts.length - 1]!;
    current[fileName] = {
      file: {
        contents: content,
      },
    };
  }
  return tree;
}
