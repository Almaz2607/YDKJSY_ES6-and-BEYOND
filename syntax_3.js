'use strict';
// -1- cycle 'for of' -----------
var a = ['a', 'b', 'c', 'd'];

for (var idx in a) {
    console.log(idx);
}
// 0 1 2 3
// --- ES6 ---
for (var v of a) {
    console.log(v);
}
// 'a' 'b' 'c' 'd'

// --- before ES6 ---
var a1 = ['a', 'b', 'c'],
    k = Object.keys(a1);

for (var val, i = 0; i < a1.length; i++) {
    val = a1[k[i]];
    console.log(val);
}
// 'a' 'b' 'c'

// - ES6 перебор итератора вручную ---
var a2 = ['f', 'g', 'h', 'i'];

for (
    var val2, ret, it = a2[Symbol.iterator]();
    (ret = it.next()) && !ret.done;

) {
    val2 = ret.value;
    console.log(val2);
}
// 'f' 'g' 'h' 'i'

// - ES6 - перебор символов строки ---
for (var v1 of 'help') {
    console.log(v1);
}
// 'h' 'e' 'l' 'p'

// --------------------------------
var o = {};

for (o.a of [1, 2, 3]) {
    console.log(o.a);
}
// 1 2 3

for ({ x: o.a } of [{ x: 1 }, { x: 2 }, { x: 3 }]) {
    console.log(o.a);
}
// 1 2 3

// - Regular Expression (RegExp) ---
// -1-
var rel = /foo/,
    str1 = '+++foo+++';

console.log(rel.lastIndex); // 0
console.log(rel.test(str1)); // true
console.log(rel.lastIndex); // 0 - не обновлено

rel.lastIndex = 4;
console.log(rel.test(str1)); // true - 'lastIndex' ignored
console.log(rel.lastIndex); // 4 - not updated

// -2- липкий флаг -----
var re2 = /foo/y, // pay attention to the flag 'y'
    str2 = '++foo++';

console.log(re2.lastIndex); // 0
console.log(re2.test(str2)); // false - 'foo' not found at position '0'

console.log(re2.lastIndex); // 0
re2.lastIndex = 2;
console.log(re2.test(str2)); // true
console.log(re2.lastIndex); // 5 - обновлено после предыдущего совпадения

console.log(re2.test(str2)); // false
console.log(re2.lastIndex); // 0 - reseted after previous unsuccessful search

// -3- липкое позиционирование -----
var re = /\d+\.\s(.*?)(?:\s|$)/y,
    str = '1. foo 2. bar 3. baz';

console.log(str.match(re)); // ['1. foo ', 'foo']

console.log(re.lastIndex); // 7 - correct position!
console.log(str.match(re)); // ['2. bar ', 'bar']

console.log(re.lastIndex); // 14 - correct position!
console.log(str.match(re)); // ['3. baz ', 'baz']

// -4- comparison of global & sticky search ---
var re4 = /o+./g, // <-- pay attention to the flag 'g'
    str4 = 'foot book more';

console.log(re4.exec(str4)); // ['oot']
console.log(re4.lastIndex); // 4

console.log(re4.exec(str4)); // ['ook']
console.log(re4.lastIndex); // 9

console.log(re4.exec(str4)); // ['or']
console.log(re4.lastIndex); // 13

console.log(re4.exec(str4)); // null - больше совпадений нет!
console.log(re4.lastIndex); // 0 - теперь начинаем сначала!

// -5- Unicode ---------------
var snowman = '\u2603';
console.log(snowman);

var gclef = '\u{1D11E}';
console.log(gclef);

// -6- Symbol ----------------
// -1-
var sym = Symbol('optional description');

console.log(typeof sym); // 'symbol'
console.log(sym instanceof Symbol); // false

var symObj = Object(sym);
console.log(symObj instanceof Symbol); // true

console.log(symObj.valueOf() === sym); // true

// -2-
var s = Symbol.for('something cool');

var desc = Symbol.keyFor(s);
console.log(desc); // 'something cool'

// снова получим символ из реестра
var s2 = Symbol.for(desc);
console.log(s2 === s); // true

// -3-
var o = {
    foo: 42,
    [Symbol('bar')]: 'hello world',
    baz: true,
};

console.log(Object.getOwnPropertyNames(o)); // ['foo', 'baz']
console.log(Object.getOwnPropertySymbols(o)); // [Symbol(bar)]
