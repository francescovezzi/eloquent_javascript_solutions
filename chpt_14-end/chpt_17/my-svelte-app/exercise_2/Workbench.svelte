<script>
  import { onMount } from "svelte";

  function ExecuteJsCode(code) {
    let wrapper = Function("", code);
    let ret = wrapper();
    console.log(code);
    return `${ret}`;
  }

  onMount(() => {
    let workbench = document.querySelector("textarea");
    let button = document.querySelector("button");
    let display = document.querySelector("#display");

    button.addEventListener("click", () => {
      display.value = ExecuteJsCode(workbench.value);
    });
  });
</script>

<main>
  Workbench:
  <textarea style="width: 50%"></textarea>
  <button> Run </button>
  <div>
    Result:
    <textarea id="display" style="width: 50%"> </textarea>
  </div>
</main>
