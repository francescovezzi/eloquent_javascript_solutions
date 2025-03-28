<script>
  import { onMount } from "svelte";

  const MOUNTAINS = [
    { name: "Kilimanjaro", height: 5895, place: "Tanzania" },
    { name: "Everest", height: 8848, place: "Nepal" },
    { name: "Mount Fuji", height: 3776, place: "Japan" },
    { name: "Vaalserberg", height: 323, place: "Netherlands" },
    { name: "Denali", height: 6168, place: "United States" },
    { name: "Popocatepetl", height: 5465, place: "Mexico" },
    { name: "Mont Blanc", height: 4808, place: "Italy/France" },
    { name: "Monte Serra", height: 917, place: "Italy" },
  ];

  function createHeader(mountain) {
    let head = document.createElement("thead");
    let row = createRow(Object.keys(mountain));
    head.appendChild(row);
    return head;
  }

  function createRow(elements) {
    let row = document.createElement("tr");
    for (let el of elements) {
      let node = document.createElement("th");
      let text_node = document.createTextNode(el);
      if (typeof el === "number") {
        node.style.textAlign = "right";
      }
      node.appendChild(text_node);
      row.appendChild(node);
    }
    return row;
  }

  function createBody(mountains) {
    let body = document.createElement("tbody");
    for (let mountain of mountains) {
      let row = createRow(Object.values(mountain));
      body.appendChild(row);
    }
    return body;
  }

  function createTable(mountains) {
    let table = document.createElement("table");
    let head = createHeader(mountains[0]);
    let body = createBody(mountains);
    table.appendChild(head);
    table.appendChild(body);
    let app = document.getElementById("app");
    app.innerHTML = "";
    app.appendChild(table);
  }

  onMount(() => {
    createTable(MOUNTAINS);
  });
</script>

<!-- <table>
  <thead>
    <tr>
      <th>name </th>
      <th>height</th>
      <th>place</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Kilimanjaro</td>
      <td>5895</td>
      <td>Tanzania</td>
    </tr>
  </tbody>
</table> -->
