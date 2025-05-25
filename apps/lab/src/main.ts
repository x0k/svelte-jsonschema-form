import { mount } from "svelte";
import { openDB } from "idb";
import { LAB_DB, type LabDBSchema } from "./shared/db.js";

import App from "./app.svelte";
import "./app.css";

const db = await openDB<LabDBSchema>(LAB_DB, 1, {
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      db.createObjectStore("projects", {
        keyPath: "id",
      });
    }
  },
});

mount(App, {
  target: document.getElementById("app")!,
  props: {
    db,
  },
});
