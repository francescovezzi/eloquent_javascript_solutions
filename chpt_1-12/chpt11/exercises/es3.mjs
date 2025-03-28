function createPromise(value, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value == null) reject("Value is null");
      else resolve(value);
    }, delay);
  });
}

// createPromise("Hello", 1000).then(console.log); // Should log "Hello" after 1 second
// createPromise(null, 1000).catch(console.log); // Should log "Value is null" after 1 second

let promise_array = [
  createPromise("C", 2000),
  createPromise("B", 1000),
  createPromise("A", 1500),
  // createPromise(null, 1800),
];

// promise_array.forEach((p) =>
//   p.then(console.log).catch((err) => console.log(`issue detected: ${err}`))
// );

// let resolved_array = [];
// let counter = 0;
// let is_rejected = false;
// promise_array.forEach((p, idx) =>
//   p
//     .then((value) => {
//       if (!is_rejected) {
//         resolved_array[idx] = value;
//         ++counter;
//         if (counter === promise_array.length) {
//           console.log(resolved_array);
//         }
//       }
//     })
//     .catch((err) => {
//       is_rejected = true;
//       console.log(err);
//     })
// );

function PromiseAll(promised_array) {
  return new Promise((resolve, reject) => {
    let counter = 0;
    let resolved_array = [];

    if (promised_array.length === 0) {
      resolve(resolved_array);
    }

    promised_array.forEach((p, idx) =>
      p
        .then((value) => {
          resolved_array[idx] = value;
          ++counter;
          if (counter === promised_array.length) {
            resolve(resolved_array);
          }
        })
        .catch(reject)
    );
  });
}

PromiseAll(promise_array)
  .then(console.log)
  .catch((err) => console.log(`Issue detected: ${err}`));
