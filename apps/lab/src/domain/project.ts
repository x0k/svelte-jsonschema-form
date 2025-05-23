import type { FromSchema } from "json-schema-to-ts";
import type { Brand } from "@sjsf/form/lib/types";
import type { Schema } from "@sjsf/form";

export type ProjectId = Brand<"project-id">;

export type ProjectFiles = Record<string, string>;

export interface Project {
  id: ProjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  files: ProjectFiles;
}

export type ProjectMeta = Omit<Project, "files">;

export interface CreateProject {
  title: string;
  files: ProjectFiles;
}

export function createProject({ title, files }: CreateProject): Project {
  const now = new Date();
  return {
    id: crypto.randomUUID() as ProjectId,
    title,
    createdAt: now,
    updatedAt: now,
    files,
  };
}

export enum ProjectPreset {
  Blank = "blank",
  Basic = "basic",
}

export const PROJECT_PRESETS = Object.values(ProjectPreset);

export const PROJECT_SETTINGS = {
  type: "object",
  properties: {
    title: {
      title: "Title",
      type: "string",
      default: "Hello world",
    },
    preset: {
      title: "Preset",
      enum: PROJECT_PRESETS,
      default: ProjectPreset.Basic,
    },
  },
  required: ["title", "preset"],
  dependencies: {
    preset: {
      oneOf: [
        {
          properties: {
            preset: {
              const: ProjectPreset.Blank,
            },
          },
        },
        {
          properties: {
            preset: {
              const: ProjectPreset.Basic,
            },
          },
        },
      ],
    },
  },
  additionalProperties: false,
} as const satisfies Schema;

export type ProjectSettings = FromSchema<typeof PROJECT_SETTINGS>;
