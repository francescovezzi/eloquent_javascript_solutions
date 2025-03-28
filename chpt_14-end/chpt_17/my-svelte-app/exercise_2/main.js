import { mount } from "svelte";
import Workbench from "./Workbench.svelte";

const app = mount(Workbench, {
  target: document.getElementById("app"),
});

export default app;
