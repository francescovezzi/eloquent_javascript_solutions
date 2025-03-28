<script>
  import { onMount } from "svelte";

  function asTabs(node) {
    let children = Array.from(node.children);
    let tabs = Array.from(node.children).map((child) => {
      let button = document.createElement("button");
      button.textContent = child.getAttribute("data-tabname");
      let tab = { button, child };
      button.addEventListener("click", () => {
        selectTab(tab);
      });
      return tab;
    });

    let tabList = document.createElement("div");
    for (let { button } of tabs) {
      tabList.appendChild(button);
    }
    node.insertBefore(tabList, node.firstChild);

    function selectTab(tab_button) {
      for (let tab of tabs) {
        if (tab == tab_button) {
          tab.child.style.display = "";
          tab.button.style.color = "blue";
        } else {
          tab.child.style.display = "none";
          tab.button.style.color = "";
        }
      }
    }

    selectTab(tabs[0]);
  }

  onMount(() => {
    asTabs(document.querySelector(".tab-panel"));
  });
</script>

<div class="tab-panel">
  <div data-tabname="one">Tab one</div>
  <div data-tabname="two">Ciao Leila!</div>
  <div data-tabname="three">Tab three</div>
</div>
