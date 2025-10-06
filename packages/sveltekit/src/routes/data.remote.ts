import { form } from '$app/server';

export const createPost = form('unchecked', (data) => {
  console.log(data);
});
