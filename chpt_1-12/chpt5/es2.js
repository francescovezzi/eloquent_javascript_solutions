function forLoop(value, testFunction, updateFunction, bodyFunction) {
  for (let i = value; testFunction(i); i = updateFunction(i)) {
    bodyFunction(i);
  }
}

forLoop(
  3,
  (n) => n > 0,
  (n) => n - 1,
  console.log
);
