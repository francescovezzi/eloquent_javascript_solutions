<script>
  import { onMount } from "svelte";

  onMount(() => {
    let img = document.querySelector("img");
    let angle = Math.PI / 2;
    function animate(time, lastTime) {
      if (lastTime != null) {
        angle += (time - lastTime) * 0.0005;
      }
      img.style.top = Math.sin(4 * angle) * 40 + 200 + "px";
      img.style.left = Math.cos(angle) * 300 + 500 + "px";
      requestAnimationFrame((newTime) => animate(newTime, time));
    }
    requestAnimationFrame(animate);
  });
</script>
