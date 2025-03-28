import { mount } from "svelte";
import Game from "./Game.svelte";
import "./game.css";

const app = mount(Game, {
  target: document.getElementById("app"),
});

export default app;
