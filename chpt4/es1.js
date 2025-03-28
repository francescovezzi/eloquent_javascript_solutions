function range(a, b, step = 1) {
  let array = [];
  if (step > 0) {
    for (a; a <= b; a += step) {
      array.push(a);
    }
  } else {
    for (a; a >= b; a += step) {
      array.push(a);
    }
  }
  return array;
}

function sum(numbers) {
  let sum = 0;
  for (n of numbers) {
    sum = sum + n;
  }
  return sum;
}

console.log(sum(range(1, 10)));
console.log(range(5, 2, -1));
console.log(range(1, 10, 2));
