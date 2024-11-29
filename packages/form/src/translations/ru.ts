import { createTranslation } from "@/form/translation.js";
import type { FailedMutation, MutationFailureReason } from '@/use-mutation.svelte.js';

export const translation = createTranslation({
  submit: "Продолжить",
  "array-schema-missing-items": "Отсутствует опция `items`",
  yes: "Да",
  no: "Нет",
  "multi-schema-option-label-with-title": (title, index) =>
    `${title} опция ${index + 1}`,
  "multi-schema-option-label": (index) => `Опция ${index + 1}`,
  "add-array-item": "Добавить элемент",
  "copy-array-item": "Клонировать",
  "add-object-property": "Добавить свойство",
  "move-array-item-down": "Вниз",
  "move-array-item-up": "Вверх",
  "remove-array-item": "Удалить",
  "remove-object-property": "Удалить",
});

const FAILURE_REASONS: Record<MutationFailureReason, string> = {
  "aborted": "Валидация прервана",
  "timeout": "Валидация завершена по таймауту",
  "error": "Что-то пошло не так во время валидации",
}

export function handleValidationProcessError (state: FailedMutation<unknown>) {
  return FAILURE_REASONS[state.reason]
}
