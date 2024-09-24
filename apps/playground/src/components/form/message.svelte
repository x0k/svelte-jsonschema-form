<script lang="ts">
  // NOTE: `$binding()` rune is not required for the components imitation
  // https://svelte-5-preview.vercel.app/#H4sIAAAAAAAAA5VSXWukQBD8K02zEAWJ755uCMcd3EOe7t4ygbhr72ZAe4aZdoOI__0YXVfzQT4eu6jqqaqeHg-6Jo_ZfY9cNoQZ3lqLCUpnw-BPVAthgt60bh-Q3O-dtrJVrEQ31jiB38Y1cHCmgavrNAzXk-xqxbnr_rBt5UI7zysmK9kb9gJ701jDxOKhgD7gStIU_nXWwBM5mhDNtpNs3huwQXGeLu44H331y7oB0q1iTLAxlT5oqjAT19KQXLIHxTfD_3LOuEuscVrHX2L162ADFLCxzlgfxevsR5KfMwsKiIKTGIrtSnsfsAe4uYEo0izkuKxHyvj2BUqgh4a8L4-UweOydNMH_QBsBA6m5eoRhviFh-lQBWwqcvpEVbQ2FSnUY-EYxz8mVU0Cp7JuKWi8lEKRQoXx63NMe3eaq2yif3aNMdBXzzGXfM4MBSj8axqSJ81HeA7Rn53ho8JX5b80abf9ecOQp_YTg-fP91WLoah-qSo0Ue5qiuIPHdXljupRf9eBnj97rt9rM09n9lvbD8N_6dTpye0DAAA=
  const { message }: any = $props();
</script>

<p style="color: red;">{message}</p>
