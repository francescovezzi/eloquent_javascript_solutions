<script>
  import { onMount } from "svelte";

  let par;
  let currentFontSize = 32;

  function onArrowUp() {
    currentFontSize *= 1.5;
    updateFontSize();
  }

  function onArrowDown() {
    currentFontSize /= 1.5;
    updateFontSize();
  }

  function updateFontSize() {
    par.style.fontSize = `${currentFontSize}px`;
  }

  function getCurrentPosition() {
    const rect = par.getBoundingClientRect();
    const center_x = rect.left + rect.width / 2;
    const center_y = rect.top + rect.height / 2;
    return [center_x, center_y];
  }

  function updateCorner([center_x, center_y]) {
    const rect = par.getBoundingClientRect();
    const corner_x = center_x - rect.width / 2;
    const corner_y = center_y - rect.height / 2;

    const parentRect = par.offsetParent.getBoundingClientRect();
    par.style.left = `${corner_x - parentRect.left}px`;
    par.style.top = `${corner_y - parentRect.top}px`;
  }

  onMount(() => {
    par = document.querySelector("p");
    updateFontSize();
    const current_center = getCurrentPosition(); // Get current center *before* scaling

    function onKeyDown(event) {
      event.preventDefault();

      if (event.key === "ArrowUp") {
        onArrowUp();
      }
      if (event.key === "ArrowDown") {
        onArrowDown();
      }

      updateCorner(current_center); // Keep center fixed
      if (currentFontSize > 120) {
        par.textContent = "💥";
        window.removeEventListener("keydown", onKeyDown);
      }
    }

    window.addEventListener("keydown", onKeyDown);
  });
</script>

<div>
  <p>🎈</p>
</div>

<style>
  p {
    position: absolute;
    top: 300px;
    left: 500px;
  }
</style>
