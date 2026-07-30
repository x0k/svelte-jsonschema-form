<script lang="ts">
  const base = import.meta.env.BASE_URL;
  const v3Base = base.replace(/playground2\/$/, 'playground3/');
</script>

<div
  class="col-span-7 bg-primary text-primary-foreground py-2 text-center text-sm"
>
  You're on the v2 playground. <a href={v3Base} class="underline">Go to v3</a>
</div>
