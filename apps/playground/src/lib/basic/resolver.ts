import {
  createComponentsResolver,
  type ComponentResolvers,
} from "@/components/form";

import { Form, SubmitButton } from './components'

export const componentResolvers: ComponentResolvers = {
  form: () => Form,
  button: () => SubmitButton,
  array: () => {
    throw new Error("Not implemented")
  },
  object: () => {
    throw new Error("Not implemented")
  },
  boolean: () => {
    throw new Error("Not implemented")
  },
  number: () => {
    throw new Error("Not implemented")
  },
  string: () => {
    throw new Error("Not implemented")
  },
  null: () => {
    throw new Error("Not implemented")
  },
  integer: () => {
    throw new Error("Not implemented")
  }
};

export const components = createComponentsResolver(componentResolvers);
