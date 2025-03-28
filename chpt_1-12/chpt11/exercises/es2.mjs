import { textFile, activityGraph } from "../utils/utils.mjs";

// function addVectors(v1, v2) {
//   if (v1.length !== v2.length) {
//     throw new Error("Vectors must have the same length");
//   }

//   return v1.map((value, index) => value + v2[index]);
// }

// function ComputeNetworkTraffic(file_content, target_day) {
//   let network_traffic = [];
//   for (let i = 0; i < 24; ++i) {
//     network_traffic.push(0);
//   }
//   console.log(target_day);

//   let counter = 0;

//   for (let timestamp_hit of file_content) {
//     let date = new Date(Number(timestamp_hit));
//     if (++counter < 20) console.log(date);
//     if (date.getDay() === target_day) {
//       ++network_traffic[date.getHours()];
//     }
//   }

//   return network_traffic;
// }

// function ComputeTotalNetworkTraffic(network_traffic_vector) {
//   let network_traffic_sum = [];
//   for (let i = 0; i < 24; ++i) {
//     network_traffic_sum.push(0);
//   }

//   for (let el of network_traffic_vector) {
//     network_traffic_sum = addVectors(network_traffic_sum, el);
//   }
//   console.log(network_traffic_sum);
//   return network_traffic_sum;
// }

// function ReadTextFile(file) {
//   return textFile(file).then((logFileList) => logFileList.split("\n"));
// }

// function activityTable(target_day) {
//   console.log(target_day);

//   let network_traffic_list = ReadTextFile("camera_logs.txt").then(
//     (logs_file_list) => {
//       let promises_array = logs_file_list.map((log_file) =>
//         ReadTextFile(log_file).then((logs) =>
//           ComputeNetworkTraffic(logs, target_day)
//         )
//       );
//       return Promise.all(promises_array);
//     }
//   );

//   return network_traffic_list.then(ComputeTotalNetworkTraffic);
// }

// async function activityTable(day) {
//   let logFileList = await textFile("camera_logs.txt");
//   // Your code here
//   let network_traffic_observation_per_hour_list = [];
//   for (let i = 0; i < 24; ++i) {
//     network_traffic_observation_per_hour_list.push(0);
//   }
//   let log_files = logFileList.split("\n");

//   for (let log_file of log_files) {
//     let file_content = await textFile(log_file);
//     file_content = file_content.split("\n");
//     let counter = 0;
//     for (let timestamp_hit of file_content) {
//       let date = new Date(Number(timestamp_hit));
//       ++network_traffic_observation_per_hour_list[date.getHours()];
//       if (date.getDay() === day) if (++counter < 20) console.log(date);
//     }
//   }
//   console.log(network_traffic_observation_per_hour_list);

//   return network_traffic_observation_per_hour_list;
// }

//   }

function activityTable(target_day) {
  let network_traffic = [];
  for (let i = 0; i < 24; ++i) {
    network_traffic[i] = 0;
  }

  return textFile("camera_logs.txt").then((logs) => {
    return Promise.all(
      logs.split("\n").map((name) =>
        textFile(name).then((content) => {
          for (let timestamp_hit of content.split("\n")) {
            let date = new Date(Number(timestamp_hit));
            if (date.getDay() === target_day) {
              ++network_traffic[date.getHours()];
            }
          }
        })
      )
    ).then(() => network_traffic);
  });
}
// return new Promise((resolve) =>
//   textFile("camera_logs.txt")
//     .then((logs_list) => logs_list.split("\n"))
//     .then((logs) => {
//       Promise.all(
//         logs.map((log) =>
//           textFile(log).then((file_raw) => {
//             let file_formatted = file_raw.split("\n");
//             for (let timestamp_hit of file_formatted) {
//               let date = new Date(Number(timestamp_hit));
//               if (date.getDay() === target_day) {
//                 ++network_traffic[date.getHours()];
//               }
//             }
//           })
//         )
//       );
//       resolve(network_traffic);
//     })
// ).then(() => network_traffic);

activityTable(1).then((table) => console.log(activityGraph(table)));
