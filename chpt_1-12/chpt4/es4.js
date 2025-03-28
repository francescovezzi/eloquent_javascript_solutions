function deepEqual(a, b) {
  if (typeof a != typeof b) {
    return false;
  }

  if (typeof a != "object") {
    return a === b;
  }

  if (Object.keys(a).length != Object.keys(b).length) {
    return false;
  }

  if (Object.keys(a).length == 0) {
    return a == null && b == null;
  }

  for (let i = 0; i < Object.keys(a).length; i++) {
    if (!deepEqual(Object.keys(a)[i], Object.keys(b)[i])) return false;
  }
  for (let key of Object.keys(a)) {
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

let obj = { here: { is: "an" }, object: 2 };
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, { here: 1, object: 2 }));
// → false
console.log(deepEqual(obj, { here: { is: "an" }, object: 2 }));
// → true
