<script>
  import { onMount } from "svelte";

  const address = "https://eloquentjavascript.net/author";
  const kAcceptHeaders = [
    "text/plain",
    "text/html",
    "application/json",
    "application/rainbows+unicorns",
  ];

  onMount(() => {
    for (let acept_header of kAcceptHeaders) {
      fetch(address, { headers: { Accept: acept_header } })
        .then((resp) => resp.text())
        .then(console.log);
    }
  });
</script>

<main></main>
