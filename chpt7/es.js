class PGroup {
  constructor(group) {
    this.group = group;
  }
  static empty = new PGroup([]);

  has(value) {
    return this.group.includes(value);
  }
  add(value) {
    if (!this.has(value)) {
      return new PGroup(this.group.concat([value]));
    }
  }
  delete(value) {
    return new PGroup(this.group.filter((v) => v !== value));
  }
}

let z = PGroup.empty;
let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false
