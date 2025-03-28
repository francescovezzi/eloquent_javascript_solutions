<script>
  import { onMount } from "svelte";

  onMount(() => {
    let idx = 0;
    let maxSize = 25;

    const onMouseMove = (event) => {
      let dot = document.createElement("div");
      dot.className = "dot";
      dot.style.left = event.pageX - 4 + "px";
      dot.style.top = event.pageY - 4 + "px";
      document.body.appendChild(dot);
      setTimeout(() => {
        dot = document.querySelector("div");
        document.body.removeChild(dot);
        idx--;
      }, 400);
      if (idx == maxSize) {
        dot = document.querySelector("div");
        document.body.removeChild(dot);
      } else {
        idx++;
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  });
</script>

<style>
  :global(body) {
    height: 200px;
    background: beige;
  }
  :global(.dot) {
    height: 8px;
    width: 8px;
    border-radius: 8px; /* rounds corners */
    background: teal;
    position: absolute;
  }
</style>
