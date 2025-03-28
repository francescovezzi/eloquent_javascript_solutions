<script>
  import { onMount } from "svelte";

  function GetNodeDescendentsByTagName(node, tag) {
    let ret = [];
    for (let child of node.childNodes) {
      if (child.nodeName === tag.toUpperCase()) {
        ret.push(child);
      }
      let child_ret = GetNodeDescendentsByTagName(child, tag);
      for (let ch_ret of child_ret) {
        ret.push(ch_ret);
      }
    }
    return ret;
  }

  onMount(() => {
    let app = document.getElementById("app");
    console.log(GetNodeDescendentsByTagName(app, "h1").length);
    // → 1
    console.log(GetNodeDescendentsByTagName(app, "span").length);
    // → 3
    let para = document.querySelector("p");
    console.log(GetNodeDescendentsByTagName(para, "span").length);
    // → 2
  });
</script>

<h1>Heading with a <span>span</span> element.</h1>
<p>A paragraph with <span>one</span>, <span>two</span> spans.</p>
