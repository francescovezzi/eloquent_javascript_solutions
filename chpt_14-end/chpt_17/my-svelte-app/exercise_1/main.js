import { mount } from "svelte";
import Fetch from "./Fetch.svelte";

const app = mount(Fetch, {
  target: document.getElementById("app"),
});

export default app;
