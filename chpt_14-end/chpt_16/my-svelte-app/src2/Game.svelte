<script>
  import { onMount } from "svelte";

  import { runGame, DOMDisplay } from "./game.js";
  import { GAME_LEVELS } from "./game_levels.js";

  // Run game after component mounts
  onMount(() => {
    runGame(GAME_LEVELS, DOMDisplay, document.body.querySelector("main"));
  });
</script>

<main>
  <!-- Game gets appended here -->
</main>

<style>
  @import "./game.css";
</style>
