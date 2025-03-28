import { mount } from "svelte";
import Conway from "./Conway.svelte";
import "./Conway.css";

const app = mount(Conway, {
  target: document.getElementById("app"),
});

export default app;
