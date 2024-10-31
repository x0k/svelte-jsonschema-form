import Ajv from "ajv";
import {
  AjvValidator,
  DEFAULT_AJV_CONFIG,
  addFormComponents,
} from "@sjsf/ajv8-validator";

export const validator = new AjvValidator(
  addFormComponents(new Ajv(DEFAULT_AJV_CONFIG))
);
