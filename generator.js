'use strict';
// --- Generators --------------
function* fo() {
    // ..
}

var iter = fo();
// чтобы начать/продолжить выполнение '*f()',
// call 'iter.next(..)'

// -1- example ---
function* foo() {
    yield 1;
    yield 2;
    yield 3;
    return 4;
}

function* bar() {
    var x = yield* foo();
    console.log('x:', x);
}

for (var v of bar()) {
    console.log(v);
}
// 1 2 3
// x: 4

// -2- example ---
function* f2(x) {
    if (x < 3) {
        var x = yield* f2(x + 1);
    }
    return x * 2;
}

var it2 = f2(1);
console.log(it2.next()); // {value: 24, done: true}

// -3- example ---
function* f() {
    var x = yield 1;
    var y = yield 2;
    var z = yield 3;
    console.log(x, y, z);
}

var it = f();

// run generator
console.log(it.next()); // {value: 1, done: false}

// answers the first question
console.log(it.next('foo')); // {value: 2, done: false}

// answers the second question
console.log(it.next('bar')); // {value: 3, done: false}

// answers the third question
console.log(it.next('baz')); // 'foo' 'bar' 'baz'
// {value: undefined, done: true}

// -4- earlier completion ----------
function* f4() {
    yield 1;
    yield 2;
    yield 3;
}

var it4 = f4();

console.log(it4.next()); // {value: 1, done: false}
console.log(it4.return(42)); // {value: 42, done: true}
console.log(it4.next()); // {value: undefined, done: true}

// -5- completion & cleanup -----------
function* f5() {
    try {
        yield 1;
        yield 2;
        yield 3;
    } finally {
        console.log('cleanup!');
    }
}

for (var v of f5()) {
    console.log(v);
}
// 1 2 3
// cleanup!

var it5 = f5();

console.log(it5.next()); // {value: 1, done: false}

console.log(it5.return(42)); // cleanup!
// {value: 42, done: true}

// -6- earlier termination --------
function* f6() {
    yield 1;
    yield 2;
    yield 3;
}

var it6 = f6();

console.log(it6.next()); // {value: 1, done: false}

try {
    it6.throw('Oops!');
} catch (err) {
    console.log(err); // error: Oops!
}

console.log(it6.next()); // {value: undefined, done: true}

// -7- error handling -----------
// --- example-1 ---
function* f7() {
    try {
        yield 1;
    } catch (err) {
        console.log(err);
    }

    yield 2;

    throw 'Hello!';
}

var it7 = f7();

console.log(it7.next()); // {value: 1, done: false}

try {
    console.log(it7.throw('Hi!')); // Hi!
    // {value: 2, done: false}
    it7.next();

    console.log('never gets here');
} catch (err) {
    console.log(err); // Hello!
}

// --- example-2 ---
function* f72() {
    try {
        yield 1;
    } catch (err) {
        console.log(err);
    }

    yield 2;

    throw 'f72: e2';
}

function* baq() {
    try {
        yield* f72();

        console.log('never gets here');
    } catch (err) {
        console.log(err);
    }
}

var it72 = baq();

try {
    console.log(it72.next()); // {value: 1, done: false}

    console.log(it72.throw('e1')); // e1
    // {value: 2, done: false}

    console.log(it72.next()); // f72: e2
    // {value: undefined, done: true}
} catch (err) {
    console.log('never gets here');
}

console.log(it72.next()); // {value: undefined, done: true}

// -9- transcompilation of the generator ---
function fow() {
    function nextState(v) {
        switch (state) {
            case 0:
                state++;

                // выражение 'yield'
                return 42;
            case 1:
                state++;

                // выражение 'yield' выполнено
                x = v;
                console.log(x);

                // неявный оператор 'return'
                return undefined;

            // не нужно обрабатывать состояние '2'
        }
    }

    var state = 0,
        x;

    return {
        next: function (v) {
            var ret = nextState(v);

            return { value: ret, done: state == 2 };
        },

        // пропустим методы 'return(..)' & 'throw(..)'
    };
}

var it9 = fow();

console.log(it9.next()); // {value: 42, done: false}

console.log(it9.next(10)); // 10
// {value: undefined, done: true}
