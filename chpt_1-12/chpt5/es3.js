function everyLoop(array, predicate) {
  if (array.length == 0) return false;
  for (let el of array) {
    if (!predicate(el)) return false;
  }
  return true;
}

function every(array, pred) {
  if (array.length == 0) return false;
  return !array.some((el) => !pred(el));
}

console.log(every([1, 3, 5], (n) => n < 10));
// → true
console.log(every([2, 4, 16], (n) => n < 10));
// → false
console.log(every([], (n) => n < 10));

console.log(everyLoop([1, 3, 5], (n) => n < 10));
// → true
console.log(everyLoop([2, 4, 16], (n) => n < 10));
// → false
console.log(everyLoop([], (n) => n < 10));
