let side_size = 8;

for (let i = 0; i < side_size; i++) {
  let row = "";
  for (let j = 0; j < side_size; j++) {
    if ((j + i) % 2 == 0) {
      row += " ";
    } else {
      row += "#";
    }
  }
  console.log(row);
}
