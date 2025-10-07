<script lang="ts">
  import { createPost } from './rf/data.remote.js'
</script>

<input {...createPost.fields.as('select multiple')} />