import { mount } from "svelte";
import { openDB } from "idb";
import { initUserConfiguration } from "@codingame/monaco-vscode-configuration-service-override";

import { LAB_DB, type LabDBSchema } from "./shared/db.js";
import { themeManager } from "./theme.svelte.js";
import "./app.css";
import { ProjectsService } from "./services/projects.js";

const [db] = await Promise.all([
  openDB<LabDBSchema>(LAB_DB, 1, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const projects = db.createObjectStore("projects", {
          keyPath: "id",
        });
        projects.createIndex("updatedAtIndex", "updatedAt");
        const files = db.createObjectStore("projectFiles");
        files.createIndex("projectIdIndex", "projectId");
      }
    },
  }),
  initUserConfiguration(
    JSON.stringify({
      "workbench.colorTheme": themeManager.editorTheme,
    })
  ),
]);

const App = await import("./app.svelte");

const projectsService = new ProjectsService(db);

mount(App.default, {
  target: document.getElementById("app")!,
  props: {
    projectsService,
  },
});
