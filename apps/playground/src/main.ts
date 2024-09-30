import { mount } from "svelte";
import "scheduler-polyfill";

import App from "./app.svelte";
import "./app.css";

mount(App, { target: document.getElementById("app")! });
