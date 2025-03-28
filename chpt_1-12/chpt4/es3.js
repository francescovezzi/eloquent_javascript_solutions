function prepend(value, list) {
  return { value, rest: list };
}

function nth(list, id) {
  if (!list) return undefined;
  if (id == 0) return list.value;
  return nth(list.rest, --id);
}

function arrayToList(array) {
  let list = null;
  for (let i = array.length - 1; i >= 0; --i) {
    list = prepend(array[i], list);
  }
  return list;
}

function listToArray(list) {
  let array = [];
  for (let node = list; node; node = node.rest) {
    array.push(node.value);
  }
  return array;
}

console.log(arrayToList([10, 20]));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(listToArray(arrayToList([10, 20, 30])));
// → [10, 20, 30]
console.log(prepend(10, prepend(20, null)));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(nth(arrayToList([10, 20, 30]), 1));
// → 20
