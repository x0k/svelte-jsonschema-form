import { mount } from "svelte";

import App from "./app.svelte";

const target = document.getElementById("app");

export default mount(App, { target: target! });
