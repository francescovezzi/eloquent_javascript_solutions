let text = "'I'm the cook,' he said, 'it's my job.'";
// Change this call.
console.log(text.replace(/(^|\W)'/g, '$1"'));
// console.log(text.replace(/(^|\P{L})'|'(\P{L}|$)/gu, '$1"$2'));
// → "I'm the cook," he said, "it's my job."
