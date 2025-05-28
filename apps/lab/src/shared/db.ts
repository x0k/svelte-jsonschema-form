import type { DBSchema } from "idb";

export interface ProjectSchemaV1 {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectSchema = ProjectSchemaV1;

export interface ProjectFileSchemaV1 {
  projectId: string;
  filename: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectFileSchema = ProjectFileSchemaV1;

export interface LabDBSchemaV1 extends DBSchema {
  projects: {
    key: string;
    value: ProjectSchemaV1;
  };
  projectFiles: {
    key: string;
    value: ProjectFileSchemaV1;
    indexes: {
      projectIdIndex: ProjectFileSchemaV1["projectId"];
    };
  };
}

export type LabDBSchema = LabDBSchemaV1;

export const LAB_DB = "lab-db";
