import { mount } from "svelte";
import MouseTrail from "./MouseTrail.svelte";

const app = mount(MouseTrail, {
  target: document.getElementById("app"),
});

export default app;
