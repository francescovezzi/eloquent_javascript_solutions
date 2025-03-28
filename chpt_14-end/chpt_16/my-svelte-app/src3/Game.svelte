<script>
  import { onMount, tick } from "svelte";
  import { DOMDisplay, Level, simpleLevelPlan, State } from "./game.js";

  let container;

  onMount(async () => {
    await tick();
    let simpleLevel = new Level(simpleLevelPlan);
    let display = new DOMDisplay(container, simpleLevel);
    display.syncState(State.start(simpleLevel));
  });
</script>

<main bind:this={container}></main>
