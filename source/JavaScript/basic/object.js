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

/* 
let person = {};

Object.defineProperty(person, 'name', {
  writable: false,
  value: 'Relsola'
});

console.log(person.name); // Relsola
person.name = 'Nick';
console.log(person.name); // Relsola
 */

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

let description = Object.getOwnPropertyDescriptor(book, 'year_');
// => {value: 2017, writable: false, enumerable: false, configurable: false}

description = Object.getOwnPropertyDescriptor(book, 'year');
// => {enumerable: true, configurable: false, get: ƒ, set: ƒ}

console.log(Object.getOwnPropertyDescriptors(book));

const dest = {
    set a(value) {
      console.log(`INVOKED DEST SETTER WITH PARAM ${value}`);
    }
  },
  src = {
    id: 'src',

    get a() {
      console.log('INVOKED DEST GETTER');
      return 'foo';
    }
  };

const result = Object.assign(dest, src, { once: true });
console.log(result); // {id: 'src', once: true}
console.log(result === dest); // true

// 调用 src 的获取方法 调用 dest 的设置方法
// 因为设置函数不进行赋值操作，所以没有把值转移过来


