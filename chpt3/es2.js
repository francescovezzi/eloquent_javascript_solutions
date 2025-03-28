function isEven(n) {
  if (n < 0) return null;
  if (n == 0) return true;
  if (n == 1) return false;
  else return isEven(n - 2);
}

function printEven(n) {
  let is_even = isEven(n);

  if (is_even == null) is_even = "minus than zero. Unacceptable.";
  else is_even = is_even ? "even" : "odd";

  console.log(`number ${n} is ${is_even}`);
}

const a = 50;
const b = 75;
const c = -1;

printEven(a);
printEven(b);
printEven(c);
