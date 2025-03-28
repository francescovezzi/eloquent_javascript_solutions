import { mount } from "svelte";
import Notes from "./Notes.svelte";

const app = mount(Notes, {
  target: document.getElementById("app"),
});

export default app;
