import type { editor } from "monaco-editor";

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
  readonly tabs: EditorTab[]
  activeTab: EditorTab
}
