import type { Brand } from "@sjsf/form/lib/types";

export type ProjectId = Brand<"project-id">;

export interface Project<S> {
  id: ProjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  state: S;
}

export type ProjectMeta = Omit<Project<unknown>, "state">;

export interface CreateProject<S> {
  title: string;
  state: S;
}

export function createProject<S>({
  title,
  state,
}: CreateProject<S>): Project<S> {
  const now = new Date();
  return {
    id: crypto.randomUUID() as ProjectId,
    title,
    createdAt: now,
    updatedAt: now,
    state,
  };
}
