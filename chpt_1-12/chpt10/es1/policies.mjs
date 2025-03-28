import { mailRoute } from "./constants.mjs";
import { pickRandomElement } from "./utils.mjs";
import { roadGraph } from "./robot.mjs";

function randomPolicy(state) {
  return { direction: pickRandomElement(roadGraph[state.place]), memory: null };
}

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

export function goalOrientedPolicy({ place, parcels }, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    let destination = place == parcel.place ? parcel.address : parcel.place;
    route = findRoute(roadGraph, place, destination);
  }
  return { direction: route[0], memory: route.slice(1) };
}

export function runPolicy(state, policy, memory) {
  let count = 0;
  while (state.parcels.length != 0) {
    let action = policy(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    ++count;
  }
  return count;
}

function findShortestRoute({ place, parcels }, graph) {
  let min_route = mailRoute;
  for (let parcel of parcels) {
    let destination = place == parcel.place ? parcel.address : parcel.place;
    let route = findRoute(roadGraph, place, destination);
    if (route.length < min_route.length) min_route = route;
  }
  return min_route;
}

export function myPolicy({ place, parcels }, route) {
  if (route.length == 0) {
    route = findShortestRoute({ place, parcels }, roadGraph);
  }
  return { direction: route[0], memory: route.slice(1) };
}
