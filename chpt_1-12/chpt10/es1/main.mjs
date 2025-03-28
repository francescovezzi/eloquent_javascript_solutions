// Robot chapter

import { VillageState } from "./robot.mjs";
import { runPolicy, goalOrientedPolicy, myPolicy } from "./policies.mjs";

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

comparePolicies(goalOrientedPolicy, myPolicy);
