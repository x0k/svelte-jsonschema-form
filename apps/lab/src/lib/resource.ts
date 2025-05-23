export type ResourceStatus = "loading" | "failed" | "success";

export interface AbstractResource<S extends ResourceStatus> {
  status: S;
}

export interface LoadingResource extends AbstractResource<"loading"> {}

export interface FailedResource<E> extends AbstractResource<"failed"> {
  error: E;
}

export interface SuccessResource<R> extends AbstractResource<"success"> {
  value: R;
}

export type Resource<R, E = unknown> =
  | LoadingResource
  | FailedResource<E>
  | SuccessResource<R>;
