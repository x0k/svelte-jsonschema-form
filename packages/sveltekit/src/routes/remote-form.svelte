<script lang="ts">
  import { createPost } from './data.remote.js'
</script>

<input {...createPost.fields.as('select multiple')} />