// Robot chapter

const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  "Marketplace-Farm",
  "Marketplace-Post Office",
  "Marketplace-Shop",
  "Marketplace-Town Hall",
  "Shop-Town Hall",
];

function buildGraph(edges) {
  let graph = Object.create(null);
  let addEdge = function (from, to) {
    if (from in graph) {
      graph[from].push(to);
    } else {
      graph[from] = [to];
    }
  };
  for (let road of roads) {
    [from, to] = road.split("-");
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);

class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }
  move(destination) {
    if (!roadGraph[this.place].includes(destination)) return this;
    let parcels = this.parcels
      .map((p) => {
        if (p.place != this.place) return p;
        return { place: destination, address: p.address };
      })
      .filter((p) => {
        return p.place != p.address;
      });
    return new VillageState(destination, parcels);
  }
  static randomVillage(parcels_number) {
    let parcels = [];
    for (let i = 0; i < parcels_number; ++i) {
      let p = {};
      p.address = pickRandomElement(Object.keys(roadGraph));
      do {
        p.place = pickRandomElement(Object.keys(roadGraph));
      } while (p.address == p.place);
      parcels.push(p);
    }
    return new VillageState("Post Office", parcels);
  }
}

function runRobot(state, policy, memory) {
  let count = 0;
  while (state.parcels.length != 0) {
    action = policy(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moving toward ${action.direction} place.`);
    ++count;
  }
  console.log(`All parcels delivered in ${count} steps.`);
}

function pickRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomPolicy(state) {
  return { direction: pickRandomElement(roadGraph[state.place]), memory: null };
}

const mailRoute = [
  "Alice's House",
  "Cabin",
  "Alice's House",
  "Bob's House",
  "Town Hall",
  "Daria's House",
  "Ernie's House",
  "Grete's House",
  "Shop",
  "Grete's House",
  "Farm",
  "Marketplace",
  "Post Office",
];

function routePolicy(state, memory) {
  if (memory.length == 0) memory = mailRoute;
  return { direction: memory[0], memory: memory.slice(1) };
}

function findRoute(graph, from, to) {
  let buffer = [{ at: from, route: [] }];
  for (let i = 0; i < buffer.length; ++i) {
    let { at, route } = buffer[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place);
      if (!buffer.some((v) => v.at == place))
        buffer.push({ at: place, route: route.concat(place) });
    }
  }
}

function goalOrientedPolicy({ place, parcels }, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    let destination = place == parcel.place ? parcel.address : parcel.place;
    route = findRoute(roadGraph, place, destination);
  }
  return { direction: route[0], memory: route.slice(1) };
}

// runRobot(VillageState.randomVillage(5), goalOrientedPolicy, []);

function runPolicy(state, policy, memory) {
  let count = 0;
  while (state.parcels.length != 0) {
    action = policy(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    ++count;
  }
  return count;
}

function comparePolicies(policy_a, policy_b) {
  const number_of_tasks = 100;
  const number_of_parcels = 5;
  let avg_policy_a = 0;
  let avg_policy_b = 0;

  for (let i = 0; i < number_of_tasks; ++i) {
    let task = VillageState.randomVillage(number_of_parcels);
    avg_policy_a += (runPolicy(task, policy_a, []) - avg_policy_a) / (i + 1);
    avg_policy_b += (runPolicy(task, policy_b, []) - avg_policy_b) / (i + 1);
  }

  console.log(`policy A and B: | ${avg_policy_a} vs ${avg_policy_b}`);
}

function findShortestRoute({ place, parcels }, graph) {
  let min_route = mailRoute;
  for (let parcel of parcels) {
    let destination = place == parcel.place ? parcel.address : parcel.place;
    route = findRoute(roadGraph, place, destination);
    if (route.length < min_route.length) min_route = route;
  }
  return min_route;
}

function myPolicy({ place, parcels }, route) {
  if (route.length == 0) {
    route = findShortestRoute({ place, parcels }, roadGraph);
  }
  return { direction: route[0], memory: route.slice(1) };
}

comparePolicies(goalOrientedPolicy, myPolicy);
