import { mount } from "svelte";
import { openDB } from "idb";
import { LAB_DB, type LabDBSchema } from "./shared/db.js";

import App from "./app.svelte";
import "./app.css";

const db = await openDB<LabDBSchema>(LAB_DB, 1, {
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
});

mount(App, {
  target: document.getElementById("app")!,
  props: {
    db,
  },
});
