// --- static function 'Array.of(..)' ---
var a = Array(3);
console.log(a.length); // 3
console.log(a[0]); // undefined

var b = Array.of(3);
console.log(b.length); // 1
console.log(b[0]); // 3

var c = Array.of(1, 2, 3);
console.log(c.length); // 3
console.log(c); // [1, 2, 3]

// --- example of use ---
class MyCoolArray extends Array {
    sum() {
        return this.reduce(function reducer(acc, curr) {
            return acc + curr;
        }, 0);
    }
}

var x = new MyCoolArray(3);
console.log(x.length); // 3 - Oops!
console.log(x.sum()); // 0 - Oops!

var y = [3]; // Array, isn't the MyCoolArray
console.log(y.length); // 1
// y.sum(); // 'sum' - isn't a function

var z = MyCoolArray.of(3);
console.log(z.length); // 1
console.log(z.sum()); // 3

// --- static function 'Array.from(..)' ---
// - array like object -
var arrLike = {
    length: 3,
    0: 'foo',
    1: 'bar',
};

// before ES6
var arr = Array.prototype.slice.call(arrLike);
var arr2 = arr.slice();

// ES6
var ar = Array.from(arrLike);
var arCopy = Array.from(ar);

// - example-2 -
var arLike = {
    length: 4,
    2: 'foo',
};

var arr1 = Array.from(arLike);
console.log(arr1);
// [undefined, undefined, 'foo', undefined]

// - example-3 -
var emptySlotArr = [];
emptySlotArr.length = 4;
emptySlotArr[2] = 'foo';
console.log(emptySlotArr);
// [empty x 2, 'foo', empty]

console.log(Array.from(emptySlotArr));
// [undefined, undefined, 'foo', undefined]

// --- как избежать пустых слотов ---
var a1 = Array(4);
// четыре пустых слота!

var b1 = Array.apply(null, { length: 4 });
// четыре значения 'undefined'

var c1 = Array.from({ length: 4 });
// четыре значения 'undefined'

// --- display ------------------------
var arrLike1 = {
    length: 4,
    2: 'foo',
};

var show = Array.from(arrLike1, function mapper(val, idx) {
    if (typeof val == 'string') {
        return val.toUpperCase();
    } else {
        return idx;
    }
});

console.log(show);
// [0, 1, 'FOO', 3]

// --- prototype methods -------------
// -1- 'copyWithin(..)' ---
console.log([1, 2, 3, 4, 5].copyWithin(3, 0));
// [1, 2, 3, 1, 2]
console.log([1, 2, 3, 4, 5].copyWithin(3, 0, 1));
// [1, 2, 3, 1, 5]
console.log([1, 2, 3, 4, 5].copyWithin(0, -2));
// [4, 5, 3, 4, 5]
console.log([1, 2, 3, 4, 5].copyWithin(0, -2, -1));
// [4, 2, 3, 4, 5]
console.log([1, 2, 3, 4, 5].copyWithin(2, 1));
// [1, 2, 2, 3, 4]

// -2- --- 'fill(..)' ---
var a2 = Array(4).fill(undefined);
console.log(a2);
// [undefined, undefined, undefined, undefined]

var a3 = [null, null, null, null].fill(42, 1, 3);
console.log(a3);
// [null, 42, 42, null]

// -3- --- 'find(..)' ---
var myArr = [1, 2, 3, 4, 5];

// --- indexOf() ---
console.log(myArr.indexOf(4)); // 3
console.log(myArr.indexOf(3) != -1); // true
console.log(myArr.indexOf(7) != -1); // false

console.log(myArr.indexOf('2') != -1); // false

// --- some() ---
console.log(
    myArr.some(function matcher(v) {
        return v == '2';
    })
); // true

console.log(
    myArr.some(function matcher(v) {
        return v == 7;
    })
); // false

// --- find() ---
console.log(
    myArr.find(function matcher(v) {
        return v == '2';
    })
); // 2

console.log(
    myArr.find(function matcher(v) {
        return v == 7;
    })
); // undefined

// -------------------------------
var points = [
    { x: 10, y: 20 },
    { x: 20, y: 30 },
    { x: 30, y: 40 },
    { x: 40, y: 50 },
    { x: 50, y: 60 },
];

console.log(
    points.find(function matcher(point) {
        return point.x % 3 == 0 && point.y % 4 == 0;
    })
); // {x: 30, y: 40}

// -4- --- 'findIndex(..)' ------------
console.log(
    points.findIndex(function matcher(point) {
        return point.x % 3 == 0 && point.y % 4 == 0;
    })
);

// 2

// -5- 'entries(..)', 'values(..)', 'keys(..)' ---
var a5 = [1, 2, 3];

console.log([...a5.values()]); // [1, 2, 3]
console.log([...a5.keys()]); // [0, 1, 2]
console.log([...a5.entries()]); // [[0, 1], [1, 2], [2, 3]]

console.log([...a5[Symbol.iterator]()]); // [1, 2, 3]

// - example -
var ar5 = [];

ar5.length = 3;
ar5[1] = 2;

console.log([...ar5.values()]); // [undefined, 2, undefined]
console.log([...ar5.keys()]); // [0, 1, 2]
console.log([...ar5.entries()]);
// [[0, undefined], [1, 2], [2, undefined]]

// --------- Object ------------------------
// -1- static function 'Object.is(..)' ---
var x = NaN,
    y = 0,
    z = -0;

console.log(x === x); // false
console.log(y === z); // true

console.log(Object.is(x, x)); // true
console.log(Object.is(y, z)); // false

// -2- 'Object.getOwnPropertySymbols(..)' ---
var o = {
    foo: 42,
    [Symbol('bar')]: 'hello world',
    baz: true,
};

console.log(Object.getOwnPropertySymbols(o));
// [Symbol(bar)]

// -3- 'Object.setPrototypeOf(..)' ---
var o1 = {
    foo() {
        console.log('foo');
    },
};
var o2 = {
    // .. definition o2 ..
};

Object.setPrototypeOf(o2, o1);

// delegate into 'o1.foo()'
o2.foo(); // 'foo'

// -4- 'Object.assign(..)' ---
var target = {},
    o1 = { a: 1 },
    o2 = { b: 2 },
    o3 = { c: 3 },
    o4 = { d: 4 };

// устанавливаем свойство только для чтения
Object.defineProperty(o3, 'e', {
    value: 5,
    enumerable: true,
    writable: false,
    configurable: false,
});

// устанавливаем неперечисляемое свойство
Object.defineProperty(o3, 'f', {
    value: 6,
    enumarable: false,
});

o3[Symbol('g')] = 7;

// устанавливаем неперечисляемый символ
Object.defineProperty(o3, Symbol('h'), {
    value: 8,
    enumarable: false,
});

Object.setPrototypeOf(o3, o4);

Object.assign(target, o1, o2, o3);

console.log(target.a); // 1
console.log(target.b); // 2
console.log(target.c); // 3

console.log(Object.getOwnPropertyDescriptor(target, 'e'));
// {value: 5, writable: true, enumerable: true, configurable: true}

console.log(Object.getOwnPropertySymbols(target));
// [Symbol('g')]
