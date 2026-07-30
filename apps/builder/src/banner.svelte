<script lang="ts">
  const base = import.meta.env.BASE_URL;
  const v3Base = base.replace(/builder\/$/, 'builder3/');
</script>

<div
  class="bg-primary text-primary-foreground py-2 px-4 text-center text-sm"
>
  You're on the v2 builder. <a href={v3Base} class="underline">Go to v3</a>
</div>
