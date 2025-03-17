Add icons content to the tailwindcss config:

```typescript
import { FLOWBITE_ICONS_CONTENT } from '@sjsf/flowbite-icons/preset'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}', FLOWBITE_ICONS_CONTENT],
}
```
