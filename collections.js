// --- TypedArray class ----------
// --- map ---
var buf1 = new ArrayBuffer(32);
console.log(buf1.byteLength); // 32

var arr = new Uint16Array(buf1);
console.log(arr.length); // 16

// --- проверка порядка байтов в среде JS ---
var littleEndian = (function () {
    var buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true);
    return new Int16Array(buffer)[0] === 256;
})();

// множественные представления
var buf = new ArrayBuffer(2);

var view8 = new Uint8Array(buf);
var view16 = new Uint16Array(buf);

view16[0] = 3085;
console.log(view8[0]); // 13
console.log(view8[1]); // 12

console.log(view8[0].toString(16)); // 'd'
console.log(view8[1].toString(16)); // 'c'

// меняем порядок (как в случае порядка байтов!)
var tmp = view8[0];
view8[0] = view8[1];
view8[1] = tmp;

console.log(view16[0]); // 3340

var a = new Uint8Array(3);
a[0] = 10;
a[1] = 20;
a[2] = 30;

var b = a.map(function (v) {
    return v * v;
});

console.log(b); // [100, 144, 132]

// у значений 20 и 30 после возведения в квадрат
// появляется разряд переполнения, поэтому
var b1 = Uint16Array.from(a, function (v) {
    return v * v;
});

console.log(b1); // [100, 400, 900]

var a2 = [10, 1, 2];
console.log(a2.sort()); // [1, 10, 2]

var b2 = new Uint8Array([10, 1, 2]);
console.log(b2.sort()); // [1, 2, 10]

// --- Maps ------------------------
// --- example-1 ---
var m = {};

var x = { id: 1 },
    y = { id: 2 };

m[x] = 'foo';
m[y] = 'bar';

console.log(m[x]); // bar
console.log(m[y]); // bar

// --- example-2 ---
var keys = [],
    vals = [];

var x2 = { id: 1 },
    y2 = { id: 2 };

keys.push(x2);
vals.push('foo');

keys.push(y2);
vals.push('bar');

console.log(keys[0] === x2); // true
console.log(vals[0]); // 'foo'

console.log(keys[1] === y2); // true
console.log(vals[1]); // 'bar'

// --- example-3 ---
var m3 = new Map();

var x3 = { id: 1 },
    y3 = { id: 2 };

m3.set(x3, 'foo');
m3.set(y3, 'bar');

console.log(m3.get(x3)); // 'foo'
console.log(m3.get(y3)); // 'bar'

// --- example-4 ---
var x4 = { id: 1 },
    y4 = { id: 2 };

var m4 = new Map([
    [x4, 'foo'],
    [y4, 'bar'],
]);

console.log(m4.get(x4)); // 'foo'
console.log(m4.get(y4)); // 'bar'

// --- Map values ---
// --- example-5 ---
var m5 = new Map();

var x5 = { id: 1 },
    y5 = { id: 2 };

m5.set(x5, 'foo');
m5.set(y5, 'bar');

var val = [...m5.values()];

console.log(val); // ['foo', 'bar']
console.log(Array.from(m5.values())); // ['foo', 'bar']

var val2 = [...m5.entries()];

console.log(val2[0][0] === x5); // true
console.log(val2[0][1]); // 'foo'

console.log(val2[1][0] === y5); // true
console.log(val2[1][1]); // 'bar'

// --- Map keys ---
var keys5 = [...m5.keys()];

console.log(keys5[0] === x5); // true
console.log(keys5[1] === y5); // true

// --- Set objects ----------------------
var s = new Set();

var u = { id: 1 },
    q = { id: 2 };

s.add(u);
s.add(q);
s.add(u);

console.log(s.size); // 2
s.delete(q);
console.log(s.size); // 1
s.clear();
console.log(s.size); // 0

// --- example-1 ---
var s1 = new Set([1, 2, 3, 4, '1', 2, 4, '5']),
    uniques = [...s1];

console.log(uniques); // [1,2,3,4,'1','5']
