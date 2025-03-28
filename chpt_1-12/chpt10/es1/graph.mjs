export function buildGraph(edges) {
  let graph = Object.create(null);
  let addEdge = function (from, to) {
    if (from in graph) {
      graph[from].push(to);
    } else {
      graph[from] = [to];
    }
  };
  for (let edge of edges) {
    let from, to;
    [from, to] = edge.split("-");
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}
