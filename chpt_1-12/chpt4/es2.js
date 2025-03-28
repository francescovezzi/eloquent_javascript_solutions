function reverseArray(array) {
  let reversed_array = [];
  for (let i = 0; i < array.length; i++) {
    reversed_array.push(array[-i - 1 + array.length]);
  }
  return reversed_array;
}

function swap(a, c) {
  let old = a;
  a = c;
  b = old;
}

function reverseArrayInPlace(array) {
  const array_legth = array.length;
  for (let i = 0; i < Math.floor(array_legth / 2); i++) {
    let last = array_legth - 1 - i;
    [array[i], array[last]] = [array[last], array[i]];
  }
}

let myArray = ["A", "B", "C"];
console.log(reverseArray(myArray));
// → ["C", "B", "A"];
console.log(myArray);
// → ["A", "B", "C"];
let arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]
