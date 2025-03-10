('use strict');
// --- example ------------------
// -1-
var abc = function () {
    // ..
};

console.log(abc.name); // 'abc'

// --- meta properties ----------
class Parent {
    constructor() {
        if (new.target === Parent) {
            console.log('Создан экземпляр родителя');
        } else {
            console.log('Создан экземпляр потомка');
        }
    }
}

class Child extends Parent {}

var a = new Parent();
// Создан экземпляр родителя

var b = new Child();
// Создан экземпляр потомка

// --- 'WKS'- well-known symbols ---
// -1- Symbol.iterator ---
var arr = [4, 5, 6, 7, 8, 9];

for (var v of arr) {
    console.log(v);
}
// 4 5 6 7 8 9

// определяем итератор, продуцирующий значения
// только из нечетных индексов
arr[Symbol.iterator] = function* () {
    var idx = 1;

    do {
        yield this[idx];
    } while ((idx += 2) < this.length);
};

for (var v of arr) {
    console.log(v);
}

// 5 7 9

// -2- Symbol.toStringTag & Symbol.hasInstance ---
function Foo(greeting) {
    this.greeting = greeting;
}

var a1 = new Foo();

console.log(a1.toString()); // [object Object]
console.log(a1 instanceof Foo); // true

// --------------------------------------------
Foo.prototype[Symbol.toStringTag] = 'Foo';

Object.defineProperty(Foo, Symbol.hasInstance, {
    value: function (inst) {
        return inst.greeting == 'hello';
    },
});

var a = new Foo('hello'),
    b = new Foo('world');

b[Symbol.toStringTag] = 'cool';

console.log(a.toString()); // [object Foo]
console.log(b.toString()); // [object cool]
console.log(String(b)); // [object cool]

console.log(a instanceof Foo); // true
console.log(b instanceof Foo); // false

// -3- Symbol.species --------------
class Cool {
    // отдаем '@@species' производному конструктору
    static get [Symbol.species]() {
        return this;
    }

    again() {
        return new this.constructor[Symbol.species]();
    }
}

class Fun extends Cool {}

class Awesome extends Cool {
    // принудительно превращаем '@@species'
    // в родительский конструктор
    static get [Symbol.species]() {
        return Cool;
    }
}

var a = new Fun(),
    b = new Awesome(),
    c = a.again(),
    d = b.again();

console.log(c instanceof Fun); // true
console.log(d instanceof Awesome); // false
console.log(d instanceof Cool); // true

// -4- Symbol.toPrimitive --------------
var arr = [1, 2, 3, 4, 5];

console.log(arr + 10); // 1,2,3,4,510

arr[Symbol.toPrimitive] = function (hint) {
    if (hint == 'default' || hint == 'number') {
        // summing of all the numbers
        return this.reduce(function (acc, curr) {
            return acc + curr;
        }, 0);
    }
};

console.log(arr + 10); // 25

// -5- Symbol.isConcatSpreadable ---
var a = [1, 2, 3],
    b = [4, 5, 6];

b[Symbol.isConcatSpreadable] = false;

console.log([].concat(a, b)); // [1, 2, 3, [4,5,6]]

// -6- --- Proxy -----------
// -1- example ---
var obj = { a: 1 };

var handler = {
    get(target, key, context) {
        // примечание: target === obj,
        // context === pobj
        console.log('accessing: ', key);
        return Reflect.get(target, key, context);
    },
};

var pobj = new Proxy(obj, handler);

console.log(obj.a); // 1

console.log(pobj.a);
// accessing: a
// 1

// -2- example ---
var handlers = {
    getOwnPropertyDescriptor(target, prop) {
        console.log('getOwnPropertyDescriptor');

        return Object.getOwnPropertyDescriptor(target, prop);
    },

    defineProperty(target, prop, desc) {
        console.log('defineProperty');

        return Object.defineProperty(target, prop, desc);
    },
};

proxy = new Proxy({}, handlers);

proxy.a = 2;
// getOwnPropertyDescriptor
// defineProperty

// --- example-2 -----------------
// --- revocable proxy ------------
var obj = { a: 1 };
var handlers = {
    get(target, key, context) {
        // note: target === obj, context === pobj
        console.log('accessing: ', key);
        return target[key];
    },
};
var { proxy: pobj, revoke: prevoke } = Proxy.revocable(obj, handlers);

pobj.a;
// accessing: a
// 1

// later
prevoke();

//pobj.a;
// TypeError

// --- proxy in the beginning ---
// --- example-3-1 ---------------
var messages = [];

var handlers2 = {
    get(target, key) {
        // is a string value?
        if (typeof target[key] == 'string') {
            // отфильтровываем пунктуацию
            return target[key].replace(/[^\w]/g, '');
        }
        // передаем все остальное
        return target[key];
    },

    set(target, key, val) {
        // задаются только уникальные строки, нижний регистр
        if (typeof val == 'string') {
            val = val.toLowerCase();
            if (target.indexOf(val) == -1) {
                target.push(val.toLowerCase());
            }
        }
        return true;
    },
};

var messages_proxy = new Proxy(messages, handlers2);

// in another place
messages_proxy.push('hello...', 42, 'wOrlD!!', 'WoRld!!');

messages_proxy.forEach(function (val) {
    console.log(val);
});
// hello world

messages.forEach(function (val) {
    console.log(val);
});
// hello... world!!

// --- example-3-2 ----------------
var obj = {
    a: 1,
    foo() {
        console.log('a:', this.a);
    },
};
var handlers = {
    get(target, key, context) {
        if (Reflect.has(target, key)) {
            return Reflect.get(target, key, context);
        } else {
            throw 'Нет такого свойства/метода!';
        }
    },
    set(target, key, val, context) {
        if (Reflect.has(target, key)) {
            return Reflect.set(target, key, val, context);
        } else {
            throw 'Нет такого свойства/метода!';
        }
    },
};
var pobj = new Proxy(obj, handlers);

pobj.a = 3;
pobj.foo(); // a: 3

// pobj.b = 4; // Error: Нет такого свойства/метода!
// pobj.bar(); // Error: Нет такого свойства/метода!

// --- proxy last ---
// --- example-4-1 -------------------------
var handlers = {
    get(target, key, context) {
        return function () {
            context.speak(key + '!');
        };
    },
};
var catchall = new Proxy({}, handlers);
var greeter = {
    speak(who = 'someone') {
        console.log('hello', who);
    },
};

// настраиваем 'greeter' на возвращение к 'catchall'
Object.setPrototypeOf(greeter, catchall);

greeter.speak(); // hello someone
greeter.speak('world'); // hello world

greeter.everyone(); // hello everyone!

// --- example-4-2 -------------------------
var handlers = {
    get() {
        throw 'Нет такого метода/свойства!';
    },
    set() {
        throw 'Нет такого метода/свойства!';
    },
};

var pobj = new Proxy(obj, handlers);
var obj = {
    a: 1,
    foo() {
        console.log('a:', this.a);
    },
};

// настраиваем 'obj' вернуться к 'pobj'
Object.setPrototypeOf(obj, pobj);

obj.a = 3;
obj.foo(); // a: 3

// obj.b = 4; // Error: Нет такого метода/свойства!
// obj.bar(); // Error: Нет такого метода/свойства!

// proxy, взламывающий цепочку [[Prototype]]
// --- example-1 ---
var handlers = {
    get(target, key, context) {
        if (Reflect.has(target, key)) {
            return Reflect.get(target, key, context);
        }
        // imitation of a looped '[[Prototype]]'
        else {
            return Reflect.get(
                target[Symbol.for('[[Prototype]]')],
                key,
                context
            );
        }
    },
};
var obj1 = new Proxy(
    {
        name: 'obj-1',
        foo() {
            console.log('foo:', this.name);
        },
    },
    handlers
);
var obj2 = Object.assign(Object.create(obj1), {
    name: 'obj-2',
    bar() {
        console.log('bar:', this.name);
        this.foo();
    },
});

// imitation a looped '[[Prototype]]' reference
obj1[Symbol.for('[[Prototype]]')] = obj2;

obj1.bar();
// bar: obj-1 <-- через прокси, имитирующий [[Prototype]]
// foo: obj-1 <-- контекст 'this' все еще сохранен

obj2.foo();
// foo: obj-2 <-- via [[Prototype]]

// --- example-2 ---
var obj1 = {
    name: 'obj-1',
    foo() {
        console.log('obj1.foo:', this.name);
    },
};
var obj2 = {
    name: 'obj-2',
    foo() {
        console.log('obj2.foo:', this.name);
    },
    bar() {
        console.log('obj2.bar:', this.name);
    },
};
var handlers = {
    get(target, key, context) {
        if (Reflect.has(target, key)) {
            return Reflect.get(target, key, context);
        }
        // imitation multiple '[[Prototype]]'
        else {
            for (var P of target[Symbol.for('[[Prototype]]')]) {
                if (Reflect.has(P, key)) {
                    return Reflect.get(P, key, context);
                }
            }
        }
    },
};
var obj3 = new Proxy(
    {
        name: 'obj-3',
        baz() {
            this.foo();
            this.bar();
        },
    },
    handlers
);

// imitation a mulitple '[[Prototype]]' references
obj3[Symbol.for('[[Prototype]]')] = [obj1, obj2];

obj3.baz();
// obj1.foo: obj-3
// obj2.bar: obj-3

// --- tail calls ----------------------------
// --- example-1 ---
function foo(x) {
    return x * 2;
}

function bar(y) {
    // not tail recursion
    return 1 + foo(y);
}

console.log(bar(10)); // 21

// --- example-2 ---
function bar2(x) {
    x = x + 1;
    if (x > 10) {
        return foo(x);
    } else {
        return bar2(x + 1);
    }
}

console.log(bar2(5)); // 24
console.log(bar2(15)); // 32

// --- tail call rewrite ----------------------
function trampoline(res) {
    while (typeof res == 'function') {
        res = res();
    }
    return res;
}

var foo = (function () {
    function _foo(acc, x) {
        if (x <= 1) return acc;
        return function partial() {
            return _foo(x / 2 + acc, x - 1);
        };
    }

    return function (x) {
        return trampoline(_foo(1, x));
    };
})();

console.log(foo(123456)); // 3810376848.5

// - recursion unrolling (разворачивание рекурсии) -
function foo(x) {
    var acc = 1;

    while (x > 1) {
        acc = x / 2 + acc;
        x = x - 1;
    }

    return acc;
}

console.log(foo(123456)); // 3810376848.5

// - self-tuning code (самонастраивающийся код) -
function foo(x) {
    function _foo() {
        if (x > 1) {
            acc = acc + x / 2;
            x = x - 1;
            return _foo();
        }
    }

    var acc = 1;

    while (x > 1) {
        try {
            _foo();
        } catch (err) {}
    }

    return acc;
}

console.log(foo(123456)); // 3810376848.5
