import * as monaco from "monaco-editor";
import type { IReference, ITextFileEditorModel } from "vscode/monaco";
import {
  RegisteredFileSystemProvider,
  RegisteredMemoryFile,
  registerFileSystemOverlay,
} from "@codingame/monaco-vscode-files-service-override";

import type { Project } from "@/domain/index.js";

export class FsService {
  #fsProvider = new RegisteredFileSystemProvider(false);
  #overlay = registerFileSystemOverlay(1, this.#fsProvider);
  #refs = new Map<string, IReference<ITextFileEditorModel>>();

  constructor() {}

  async registerProjectFiles(project: Project) {
    for (const [filename, content] of Object.entries(project.files)) {
      const fileUri = monaco.Uri.file(filename);
      this.#fsProvider.registerFile(new RegisteredMemoryFile(fileUri, content));
      const ref = await monaco.editor.createModelReference(fileUri);
      console.log(ref.object)
      this.#refs.set(filename, ref);
    }
  }

  disposeProjectFiles() {
    for (const ref of this.#refs.values()) {
      ref.dispose();
    }
    this.#refs.clear()
  }
}
