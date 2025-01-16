import type { Action } from "svelte/action";
import type {
  FormContext,
  Errors,
  FormValue,
  Config,
  ValidationError,
  FieldErrors,
} from "@sjsf/form";
import type { Mutation } from "@sjsf/form/use-mutation.svelte";
import type { EventHandler, FormEventHandler } from 'svelte/elements';

interface FormState<T, E> {
  value: T | undefined;
  errors: Errors<E>;
  isSubmitted: boolean;
  isChanged: boolean;
  validation: Mutation<
    [event: SubmitEvent],
    {
      snapshot: FormValue;
      validationErrors: Errors<E>;
    },
    unknown
  >;
  fieldsValidation: Mutation<
    [config: Config<unknown>, value: FormValue],
    ValidationError<E>[],
    unknown
  >;
  validate(): Errors<E>;
  validateAsync(signal: AbortSignal): Promise<Errors<E>>;
  submit(e: SubmitEvent): void;
  reset(): void;
  updateErrorsByPath(
    path: Array<string | number>,
    update: (errors: FieldErrors<E>) => Omit<ValidationError<E>, "instanceId">[]
  ): void;
}

interface FormInternals {
  enhance: Action;
  context: FormContext;
  formValue: FormValue;
  submitHandler: EventHandler<SubmitEvent, HTMLFormElement>
  resetHandler: FormEventHandler<HTMLFormElement>
}
