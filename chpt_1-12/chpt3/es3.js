function countChar(word, char) {
  let count = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] == char) count++;
  }
  return count;
}

function countBs(word) {
  return countChar(word, "B");
}

console.log(countBs("BOB"));
console.log(countChar("kakkerlak", "k"));
