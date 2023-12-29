{
  let person = {
    name: 'Relsola',
    age: 18,
    job: 'Software Engineer',
    sayName() {
      console.log(this.name);
    }
  };
}
{
  let person = {};

  Object.defineProperty(person, 'name', {
    writable: false,
    value: 'Relsola'
  });

  console.log(person.name); // Relsola
  person.name = 'Nick';
  console.log(person.name); // Relsola
}

{
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
}

{
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
}

{
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
}

{
  const dest = {},
    src = {
      a: [1, 2, 3],

      get b() {
        throw new Error();
      },

      c: 'bar'
    };

  try {
    Object.assign(dest, src, { once: true });
  } catch (e) {}

  console.log(dest); // {a: Array(3)}
  src.a.pop();
  console.log(dest.a); // [1, 2]
}

{
  // 符合预期的情况
  console.log(true === 1, Object.is(true, 1)); // false false
  // console.log({} === {}, Object.is({}, {})); //  false false
  console.log('2' === 2, Object.is('2', 2)); // false false

  // 0 -0 +0 相等/不相等判断
  console.log(+0 === +0, Object.is(+0, -0)); // true false
  console.log(+0 === 0, Object.is(+0, 0)); // true true
  console.log(-0 === 0, Object.is(-0, 0)); // true false

  // 正确的 NaN 判断
  console.log(NaN === NaN); // false
  console.log(Object.is(NaN, NaN)); // true
  // isNaN会先将参数转换 Number，然后对转换后的结果是否是NaN进行判断，不建议使用
  // Number.isNaN() 静态方法判断值是否为 NaN，如果输入不是 number 类型，则返回 false
  console.log(isNaN(NaN), Number.isNaN(NaN)); // true true
}

function recursivelyCheckEqual(x, ...rest) {
  return Object.is(x, rest[0]) && (rest.length < 2 || recursivelyCheckEqual(...rest));
}

{
  let name = 'Relsola';
  let person = { name }; // 等价于  let person = { name: name };
}

{
  // let person = {
  //   name: 'Relsola',
  //   sayName: function () {
  //     console.log(this.name);
  //   }
  // };

  let person = {
    name: 'Relsola',
    sayName() {
      console.log(this.name);
    }
  };
  person.sayName(); // Relsola
}

{
  const name = 'name';
  const age = 'age';
  const job = 'job';
  let uniqueToken = 0;

  function getUniqueKey(key) {
    return `${key}_${uniqueToken++}`;
  }

  let person = {
    [getUniqueKey(name)]: 'Relsola',
    [getUniqueKey(age)]: 18,
    [getUniqueKey(job)]() {
      console.log('Software engineer');
    }
  };

  console.log(person); // {name_0: 'Relsola', age_1: 18, job_2: ƒ}
}

let person = {
  name: 'Relsola',
  age: 18,
  job() {
    console.log('Software engineer');
  },
  
};

// 不使用解构
let personName = person.name,
  personAge = person.age;

console.log(personName); // Matt
console.log(personAge); // 27
// Second, using object destructuring:
// // With object destructuring
// let person = {
//   name: 'Matt',
//   age: 27
// };

// let { name: personName, age: personAge } = person;

// console.log(personName);  // Matt
// console.log(personAge);   // 27
