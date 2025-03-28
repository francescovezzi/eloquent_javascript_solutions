import { roads } from "./constants.mjs";
import { buildGraph } from "./graph.mjs";
import { pickRandomElement } from "./utils.mjs";

export const roadGraph = buildGraph(roads);

export class VillageState {
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

export function runRobot(state, policy, memory) {
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
