import type { DBSchema } from "idb";

import type { Project } from "@/domain/project.js";

export interface LabDBSchemaV1 extends DBSchema {
  projects: {
    key: string;
    value: Project;
  };
}

export type LabDBSchema = LabDBSchemaV1;
