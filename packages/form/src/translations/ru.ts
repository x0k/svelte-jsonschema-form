import { createTranslation } from "@/core/translation";

export const translation = createTranslation({
  submit: "Продолжить",
  "unsupported-field-type": (type) => `Неподдерживаемый тип поля: ${type}`,
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
