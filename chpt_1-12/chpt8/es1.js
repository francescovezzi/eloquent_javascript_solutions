class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a, b) {
  if (Math.random() > 1 - 0.8) {
    throw new MultiplicatorUnitFailure(
      "Bro I randomly fail 80% of the time. Please retry."
    );
  }
  return a * b;
}

while (true) {
  try {
    let result = primitiveMultiply(2, 4);
    console.log(`result amounts to: ${result}`);
    break;
  } catch (error) {
    if (error instanceof MultiplicatorUnitFailure) {
      console.log(`multiplication failure happened: ${error}`);
    } else {
      throw error;
    }
  }
}

while (true) {
  try {
    let result = grimitiveMultiply(2, 4);
    console.log(`result amounts to: ${result}`);
    break;
  } catch (error) {
    if (error instanceof MultiplicatorUnitFailure) {
      console.log(`multiplication failure happened: ${error}`);
    } else {
      throw error;
    }
  }
}
