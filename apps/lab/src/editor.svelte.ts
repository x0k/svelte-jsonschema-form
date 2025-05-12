import { editor } from "monaco-editor";

export enum Language {
  Svelte = "svelte",
  TypeScript = "typescript",
  JavaScript = "javascript",
}

export interface EditorTab {
  model: editor.ITextModel;
  language: Language;
  filename: string;
}

export interface EditorState {
  readonly tabs: EditorTab[];
  readonly activeTab: EditorTab;
}

export function createEditorState(): EditorState {
  const model = editor.createModel("");
  const tabs: EditorTab[] = $state([
    {
      model,
      filename: "",
      get language() {
        return model.getLanguageId() as Language;
      },
    },
  ]);
  const selectedTab = $state.raw(0);

  return {
    get tabs() {
      return tabs;
    },
    get activeTab() {
      return tabs[selectedTab]!;
    },
  };
}
