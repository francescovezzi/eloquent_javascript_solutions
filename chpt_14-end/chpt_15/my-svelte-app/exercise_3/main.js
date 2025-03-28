import { mount } from "svelte";
import Tab from "./Tab.svelte";

const app = mount(Tab, {
  target: document.getElementById("app"),
});

export default app;
