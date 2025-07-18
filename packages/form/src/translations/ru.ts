import { fromRecord } from "@/lib/resolver.js";
import type { TaskFailureReason } from "@/lib/task.svelte.js";
import type { TranslatorDefinitions } from "@/form/translation.js";

export const definitions: TranslatorDefinitions = {
  submit: "Продолжить",
  "array-schema-missing-items": "Отсутствует опция `items`",
  yes: "Да",
  no: "Нет",
  "multi-schema-option-label-with-title": ({ title, index }) =>
    `${title} опция ${index + 1}`,
  "multi-schema-option-label": ({ index }) => `Опция ${index + 1}`,
  "add-array-item": "Добавить элемент",
  "copy-array-item": "Клонировать",
  "add-object-property": "Добавить свойство",
  "move-array-item-down": "Вниз",
  "move-array-item-up": "Вверх",
  "remove-array-item": "Удалить",
  "remove-object-property": "Удалить",
  "validation-process-error": ({ error }) => FAILURE_REASONS[error.reason],
  "component-not-found": ({ type }) => `Компонент "${type}" не найден`,
  "key-input-title": ({ name }) => `${name} Ключ`,
  "additional-property": "Дополнительное свойство",
};

const FAILURE_REASONS: Record<TaskFailureReason, string> = {
  aborted: "Валидация прервана",
  timeout: "Валидация завершена по таймауту",
  error: "Что-то пошло не так во время валидации",
};

export const translation = fromRecord(definitions);
