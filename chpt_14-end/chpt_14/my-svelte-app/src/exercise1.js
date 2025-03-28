import { mount } from "svelte";
import Table from "./exercise_1/Table.svelte";

const app = mount(Table, {
  target: document.getElementById("app"),
});

export default app;
