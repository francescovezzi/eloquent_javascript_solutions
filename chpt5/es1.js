function flatten(nested_array) {
  let callback = (cum, arr) => cum.concat(arr);
  return nested_array.reduce(callback, []);
}

console.log(
  flatten([
    [1, 2, 3],
    [2, 3],
    [5, 6, 4],
  ])
);
