import { mount } from "svelte";
import Balloon from "./Balloon.svelte";

const app = mount(Balloon, {
  target: document.getElementById("app"),
});

export default app;
