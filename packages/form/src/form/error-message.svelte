<script lang="ts" module>
  import Message from './error-message.svelte';

  export function createMessage(message: string): typeof Message {
    return (internal) =>
      Message(internal, { message });
  }
</script>

<script lang="ts">
  // NOTE: `$binding()` rune is not required for the components imitation
  // because we replacing original props with the binding info
  // https://svelte-5-preview.vercel.app/#H4sIAAAAAAAAA41TwY6bMBT8lScr0oKE4E4hq6pqpR5yam_rlZbAI7FkbMt-JEWIf69sksBmt9u94aeZ55nxMLJWSHQsfxqZqjpkOftqDEsYDcYf3AklIUuY072t_aSYR7k2JLRyYHuFDrItV4WrrTC05YqT6Iy2BD-07aC1uoOHNPOHdGY_rDC74acyPd1gl_MKqTjVWjmCWndGK1TkoITRzzllGfwejIYjWpwnQpmB8uteP5u4KrJFnSqCrnFZNwUDLGGdbkQrsGE52R6n5JaKZ3wcyxvz363V9mYrnNb2F1vj2tgEJWyM1cZF8dr7AenbFQUlRF5JDOV2xX3ys2d4fIQoEorQqkomEHYF5JLYrqeKhDqE1IA0GIsO7QmhUoBe6Q06QpqmYUcCHTpXHTAHztI05QwmOAspoRV_gI54x9z3FKYWHYFuw7dfhJYEupm5R1BagcWqJnG6PGC4Lb1cBiW8LMY3o_c4gdIEre5V8zJTLFJv1Rz5G--hAq_CnBtXwqZBK07YROt0I85EaA6L4y8zSyLBqZK9V7NxVBFGnHEW3_dq3rsXqsln-P9qdSnpZ5vldYyLEn9RtZcYxXe1ea1KVnuUgb8bQFx_ikK8J7bIruiPZIecPyv6WvLlQTn7pTuko2_g2T_r2Wp1CH36twsDjgaJJWe1ltrmYLHhDLbjZe9UZOZd2c_TX2sKgF_mBAAA
  const { message }: any = $props();
</script>

<pre style="color: red;">{message}</pre>
