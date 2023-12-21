/* 
let person = {
  name: 'Relsola',
  age: 18,
  job: 'Software Engineer',
  sayName() {
    console.log(this.name);
  }
};
 */
let person = {};

Object.defineProperty(person, 'name', {
  writable: false,
  value: 'Relsola'
});

console.log(person.name); // Relsola
person.name = 'Nick';
console.log(person.name); // Relsola

/* 
// 定义一个对象，包含伪私有成员 year_ 和公共成员 `edition`
let book = {
  year_: 2017,
  edition: 1
};

Object.defineProperty(book, 'year', {
  get() {
    return this.year_;
  },
  set(newVal) {
    if (newVal > 2017) {
      this.year_ = newVal;
      this.edition += newVal - 2017;
    }
  }
});
book.year = 2018;
console.log(book.edition);
 */

let book = {};
Object.defineProperties(book, {
  year_: {
    value: 2017
  },
  edition: {
    value: 2017
  },
  year: {
    enumerable: true,
    get() {
      return this.year_;
    },
    set(newVal) {
      if (newVal > 2017) {
        this.year_ = newVal;
        this.edition += newVal - 2017;
      }
    }
  }
});
