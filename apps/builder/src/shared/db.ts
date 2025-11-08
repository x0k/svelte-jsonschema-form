import type { DBSchema } from "idb";

export interface ProjectSchemaV1 {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  state: unknown;
}

export type ProjectSchema = ProjectSchemaV1;

export interface AppDBSchemaV1 extends DBSchema {
  projects: {
    key: string;
    value: ProjectSchemaV1;
    indexes: {
      updatedAtIndex: ProjectSchemaV1["updatedAt"];
      titleIndex: ProjectSchemaV1['title']
    };
  };
}

export type AppDBSchema = AppDBSchemaV1;
