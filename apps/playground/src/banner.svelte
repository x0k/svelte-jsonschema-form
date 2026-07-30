<script lang="ts">
  const base = import.meta.env.BASE_URL;
  const v2Base = base.replace(/playground\/$/, 'playground2/');
</script>

<div
  class="bg-blue-600 text-white py-2 text-center text-sm"
>
  You're on the v1 playground. <a href={v2Base} class="underline">Go to v2</a>
</div>
