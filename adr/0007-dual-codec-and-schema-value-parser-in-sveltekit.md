# 0007. Dual Codec and Schema-Value Parser in SvelteKit

The `@sjsf/sveltekit` package has two completely separate codec + schema-value-parser implementations:

- **Classic mode** (`src/lib/internal/`): works with flat `FormData` entries. Schema property keys may contain common delimiters (`.`, `@`, `::`), which would lead to ambiguity during parsing. The codec uses trie-based multi-character sequence encoding to avoid collisions.

- **Remote Functions mode** (`src/lib/rf/internal/`): works with nested `Record<string, unknown>`. SvelteKit's remote functions impose restrictions on the format of field names, so form field names must conform to this format in order to work when JavaScript is disabled — otherwise SvelteKit will not parse the FormData correctly.
