class Group {
  constructor() {
    this.group = [];
  }
  has(value) {
    return this.group.includes(value);
  }
  add(value) {
    if (!this.has(value)) {
      this.group.push(value);
    }
  }
  delete(value) {
    this.group.filter((v) => v !== value);
  }
  static from(iterable) {
    let group = new Group();
    for (let it of iterable) {
      group.add(it);
    }
    return group;
  }
  [Symbol.iterator]() {
    return new GroupIterator(this);
  }
}

class GroupIterator {
  constructor(group) {
    this.group = group;
    this.curr = 0;
  }
  next() {
    let val = this.group.group[this.curr++];
    if (this.curr > this.group.group.length) return { done: true };
    return { value: val, done: false };
  }
}

for (let value of Group.from(["a", "b", "c"])) {
  console.log(value);
}

let group = Group.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));
// → false
