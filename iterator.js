// --- Iterators ---------------
// -1- array ---
var arr = [1, 2];

var it = arr[Symbol.iterator]();

console.log(it.next()); // {value: 1, done: false}
console.log(it.next()); // {value: 2, done: false}

console.log(it.next()); // {value: undefined, done: true}

// -2- string ---
var str = 'hi';

var ite = str[Symbol.iterator]();

console.log(ite.next()); // {value: 'h', done: false}
console.log(ite.next()); // {value: 'i', done: false}

console.log(ite.next()); // {value: undefined, done: true}

// -3- collection ---
var m = new Map();
m.set('foo', 42);
m.set({ cool: true }, 'hello world');

var it2 = m[Symbol.iterator]();
var it3 = m.entries();

console.log(it2.next()); // {value: ['foo', 42], done: false}
console.log(it3.next()); // {value: ['foo', 42], done: false}

// -4- iterator cycle ---
var iter = {
    // делаем итератор 'iter' итерируемым
    [Symbol.iterator]() {
        return this;
    },

    next() {},
};

console.log(iter[Symbol.iterator]() === iter); // true

// -5- user iterators ---
// -1- example ---
var Fib = {
    [Symbol.iterator]() {
        var n1 = 1,
            n2 = 1;

        return {
            // make iterator iterable
            [Symbol.iterator]() {
                return this;
            },

            next() {
                var current = n2;
                n2 = n1;
                n1 = n1 + current;
                return { value: current, done: false };
            },

            return(v) {
                console.log('The Fibonacci sequence is complete.');
                return { value: v, done: true };
            },
        };
    },
};

for (var v of Fib) {
    console.log(v);

    if (v > 50) break;
}
// 1 1 2 3 5 8 13 21 34 55
// The Fibonacci sequence is complete.

// -2- example ---
var tasks = {
    [Symbol.iterator]() {
        var steps = this.actions.slice();

        return {
            // make iterator iterable
            [Symbol.iterator]() {
                return this;
            },

            next(...args) {
                if (steps.length > 0) {
                    let res = steps.shift()(...args);
                    return { value: res, done: false };
                } else {
                    return { done: true };
                }
            },

            return(v) {
                steps.length = 0;
                return { value: v, done: true };
            },
        };
    },
    actions: [],
};

tasks.actions.push(
    function step1(x) {
        console.log('step 1:', x);
        return x * 2;
    },
    function step2(x, y) {
        console.log('step 2:', x, y);
        return x + y * 2;
    },
    function step3(x, y, z) {
        console.log('step 3:', x, y, z);
        return x * y + z;
    }
);

var it1 = tasks[Symbol.iterator]();

console.log(it1.next(10)); // step 1: 10
// {value: 20, done: false}
console.log(it1.next(20, 50)); // step 2: 20 50
// {value: 120, done: false}
console.log(it1.next(20, 50, 120)); // step 3: 20 50 120
// {value: 1120, done: false}
console.log(it1.next()); // {done: true}
