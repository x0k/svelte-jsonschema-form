# SJSF Component Types and Roles

SJSF divides all theme components into 4 distinct categories:

## 1. Generic Components (`components`)

Structural UI building blocks that do not directly manage form values:

| Component Name | Description | Key Props |
| :--- | :--- | :--- |
| `form` | Wraps the `<form>` element | `onsubmit`, `onreset`, children snippet |
| `submitButton` | Default submit button (disables during validation/submitting) | `disabled`, children |
| `button` | Generic theme button | `variant`, `disabled`, onclick |
| `layout` | Layout wrapper for form content | children |
| `title` | Field or section title | `title`, `required` |
| `label` | Input label associated with an element ID | `forId`, `label`, `required` |
| `description`| Help/explanatory text below or above input | `description` |
| `help` | Tooltip or secondary help text | `help` |
| `errorsList` | Container displaying error messages | `errors` |

---

## 2. Input Controls (`widgets`)

Direct input elements handling value changes:

| Widget Name | Typical Schema Target | Key Props |
| :--- | :--- | :--- |
| `textWidget` | `string` | `value = $bindable()`, `config`, `handlers` |
| `numberWidget` | `number`, `integer` | `value = $bindable()`, `config`, `handlers` |
| `checkboxWidget` | `boolean` | `value = $bindable()`, `config`, `handlers` |
| `selectWidget` | `string` or `number` with `enum` | `value = $bindable()`, `config`, `handlers` |
| `radioWidget` | `string` or `number` with `enum` | `value = $bindable()`, `config`, `handlers` |
| `fileWidget` | `string` with format `data-url` | `value = $bindable()`, `config`, `handlers` |
| `rangeWidget` | `number` with `minimum`/`maximum` | `value = $bindable()`, `config`, `handlers` |
| `textareaWidget` | Multi-line text | `value = $bindable()`, `config`, `handlers` |

---

## 3. Layout & Structure (`templates`)

Templates orchestrate field wrappers, array tables/lists, and object field grids:

| Template Name | Role |
| :--- | :--- |
| `fieldTemplate` | Standard wrapper rendering label, widget, description, and errors |
| `objectTemplate` | Iterates over object properties and renders individual fields |
| `objectPropertyTemplate` | Wrapper around an individual property in an object |
| `arrayTemplate` | Renders array items, add/remove buttons, and reordering controls |
| `arrayItemTemplate` | Wrapper around an individual item in an array |

---

## 4. Resolvers (`fields`)

Resolvers map a schema definition to the corresponding field template and widget. The foundational field types are:
- `stringField`, `numberField`, `booleanField`, `objectField`, `arrayField`, `nullField`, `oneOfField`, `anyOfField`.
