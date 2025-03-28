import { textFile, activityGraph } from "../utils/utils.mjs";

async function activityTable(day) {
  let logFileList = await textFile("camera_logs.txt");
  // Your code here
  let network_traffic_observation_per_hour_list = [];
  for (let i = 0; i < 24; ++i) {
    network_traffic_observation_per_hour_list.push(0);
  }
  let log_files = logFileList.split("\n");

  for (let log_file of log_files) {
    let file_content = await textFile(log_file);
    file_content = file_content.split("\n");
    let counter = 0;
    for (let timestamp_hit of file_content) {
      let date = new Date(Number(timestamp_hit));
      ++network_traffic_observation_per_hour_list[date.getHours()];
      if (date.getDay() === day) if (++counter < 20) console.log(date);
    }
  }
  console.log(network_traffic_observation_per_hour_list);

  return network_traffic_observation_per_hour_list;
}

activityTable(1).then((table) => console.log(activityGraph(table)));
