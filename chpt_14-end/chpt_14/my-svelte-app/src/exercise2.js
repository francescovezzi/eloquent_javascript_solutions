import { mount } from "svelte";
import GetNodeDescendentsByTagName from "./exercise_2/GetNodeDescendentsByTagName.svelte";

const app = mount(GetNodeDescendentsByTagName, {
  target: document.getElementById("app"),
});

export default app;
