<script>
  import { onMount } from "svelte";
  import { State } from "./lib/rules";

  const kRows = 15;
  const kColumns = 15;
  const kIsCheckedProbability = 0.2;

  function CreateCheckbox(is_checked = false) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = is_checked;
    return checkbox;
  }

  onMount(() => {
    let state = new State(kRows, kColumns);
    let main_div = document.querySelector("#grid");
    main_div.classList.add("checkbox-container");

    for (let r = 0; r < kRows; r++) {
      let row = document.createElement("div");
      row.classList.add("checkbox-row");

      for (let c = 0; c < kColumns; c++) {
        let is_checked = Math.random() < kIsCheckedProbability;
        let node = CreateCheckbox(is_checked);
        state.Set(r, c, node);
        row.appendChild(node);
      }
      main_div.appendChild(row);
    }

    let button = document.querySelector("button");
    button.addEventListener("click", () => {
      state.Update();
    });
  });
</script>

<main>
  <div id="grid"></div>
  <button> Next Generation </button>
</main>
