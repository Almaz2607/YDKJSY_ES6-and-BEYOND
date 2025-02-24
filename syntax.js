'use strict';
// объявления на уровне блоков кода
// оператор let
var a = 2;

if (a > 1) {
    let b = a * 3;
    console.log(b); // 6

    for (let i = a; i <= b; i++) {
        let j = i + 10;
        console.log(j);
        // 12, 13, 14, 15, 16
    }

    let c = a + b;
    console.log(c); // 8
}

// --- оператор let & цикл for -----
var funcs = [];

for (let i = 0; i < 5; i++) {
    funcs.push(function () {
        console.log(i);
    });
}

funcs[3](); // 3

// --- операторы Spread & Rest -----
// --- example-1 ---
function foo(x, y, z) {
    console.log(x, y, z);
}
// ES6
foo(...[1, 2, 3]); // 1 2 3
// before ES6
foo.apply(null, [1, 2, 3]); // 1 2 3

// --- example-2 ---
var a = [2, 3, 4];
var b = [1, ...a, 5];
// ES6
console.log(b); // [1,2,3,4,5]
// before ES6
console.log([1].concat(a, 5)); // [1,2,3,4,5]

// --- example-3 ---
function bar(x, y, ...z) {
    console.log(x, y, z);
}

bar(1, 2, 3, 4, 5); // 1 2 [3,4,5]

function bar2(...args) {
    console.log(args);
}

bar2(1, 2, 3, 4, 5); // [1,2,3,4,5]

// --- example-3 ---
// --- ES6 ---
function foo3(...args) {
    // 'args' it's a real array

    // отбрасываем первый элемент в массиве 'args'
    args.shift();

    console.log(...args);
}
// --- before ES6 ---
function bar3() {
    // преобразуем 'arguments' в настоящий массив
    var args = Array.prototype.slice.call(arguments);

    // добавляем в конец какие-то элементы
    args.push(4, 5);
    // убираем нечетные числа
    args = args.filter(function (v) {
        return v % 2 == 0;
    });

    // передаем все содержимое 'args' как
    // аргументы в функцию 'foo(..)'
    foo3.apply(null, args);
}

bar3(0, 1, 2, 3); // 2 4

// - значение параметров по умолчанию ---
function foz(x = 11, y = 31) {
    console.log(x + y);
}

foz(); // 42
foz(5, 6); // 11
foz(5); // 36
foz(0, 42); // 42

foz(5, undefined); // 36 <-- 'undefined' отсутствует
foz(5, null); // 5 <-- null приводится к '0'

// - выражения как значения по умолчанию ---
function baz(val) {
    console.log('baz called!');
    return y + val;
}

function fox(x = y + 3, z = baz(x)) {
    console.log(x, z);
}

var y = 5;
fox(); // 8 13
fox(10); // 10 15

y = 6;
fox(undefined, 10); // 9 10

// - structured assignment -
function foq() {
    return [1, 2, 3];
}

var tmp = foq(),
    a = tmp[0],
    b = tmp[1],
    c = tmp[2];
console.log(a, b, c); // 1 2 3

// --- destructured assignment ---
var [a, b, c] = foq();
console.log(a, b, c); // 1 2 3

function baq() {
    return {
        x: 4,
        y: 5,
        z: 6,
    };
}

var tmp2 = baq(),
    x = tmp2.x,
    y = tmp2.y,
    z = tmp2.z;
console.log(x, y, z); // 4 5 6

// --- destructured assignment ---
var { x: q, y: m, z: n } = baq();

console.log(q, m, n); // 4 5 6

// не только в объявлениях ---
var o = {};

[o.a, o.b, o.c] = foq();
({ x: o.x, y: o.y, z: o.z } = baq());

console.log(o.a, o.b, o.c); // 1 2 3
console.log(o.x, o.y, o.z); // 4 5 6

// - создание отображений/преобразований объекта -
// - example-1 -
var o1 = { a: 1, b: 2, c: 3 },
    o2 = {};

({ a: o2.x, b: o2.y, c: o2.z } = o1);
console.log(o2.x, o2.y, o2.z); // 1 2 3

// - {} --> [] -
var ob1 = { a: 1, b: 2, c: 3 },
    a2 = [];

({ a: a2[0], b: a2[1], c: a2[2] } = ob1);
console.log(a2); // [1, 2, 3]

// - [] --> {} -
var a1 = [1, 2, 3],
    ob2 = {};

[ob2.a, ob2.b, ob2.c] = a1;
console.log(ob2.a, ob2.b, ob2.c); // 1 2 3

// - [] --> [] -
var ar1 = [4, 5, 6],
    ar2 = [];

[ar2[2], ar2[0], ar2[1]] = ar1;
console.log(ar2); // [4, 5, 6]

// --- var1 <--> var2 ---
var x = 10,
    y = 20;

[y, x] = [x, y];

console.log(x, y); // 20 10

// --- повторные присваивания ---
// --- 1 ---
var { a: X, a: Y } = { a: 1 };

console.log(X, Y); // 1 1

// --- 2 ---
var {
    a: { x: X, x: Y },
    a,
} = { a: { x: 1 } };

console.log(X, Y, a); // 1 1 {x: 1}

// --- 3 ---
({
    a: X,
    a: Y,
    a: [z],
} = { a: [1] });

X.push(2);
Y[0] = 10;

console.log(X); // [10, 2]
console.log(Y); // [10, 2]
console.log(z); // 1

// - destructured assignment expressions -
// --- 1 ---
var obj = { a: 1, b: 2, c: 3 },
    a,
    b,
    c,
    p;

p = { a, b, c } = obj;
console.log(p);
console.log(a, b, c); // 1 2 3
console.log(p === obj); // true

// --- 2 ---
var arr = [1, 2, 3],
    d,
    e,
    f,
    p1;

p1 = [d, e, f] = arr;

console.log(d, e, f); // 1 2 3
console.log(p1 === arr); // true

// --- 3 ---
var o3 = { a3: 7, b3: 8, c3: 9 },
    p3 = [3, 4, 5],
    a3,
    b3,
    c3,
    x3,
    y3,
    z3;

({ a3 } = { b3, c3 } = o3);
[x3, y3] = [z3] = p3;

console.log(a3, b3, c3); // 7 8 9
console.log(x3, y3, z3); // 3 4 3

// - assignment default values -
var [a = 3, b = 6, c = 9, d = 12] = foq();
var { x = 5, y = 10, z = 15, w = 20 } = baq();

console.log(a, b, c, d); // 1 2 3 12
console.log(x, y, z, w); // 4 5 6 20
