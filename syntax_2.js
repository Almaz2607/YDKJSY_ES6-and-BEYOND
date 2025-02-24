var x = 200,
    y = 300,
    z = 100;

var o = { x: { y: 42 }, z: { y: z } };
console.log(o);

({ y: x = { y: y } } = o);
console.log(x); // {y: 300}
({ z: y = { y: z } } = o);
console.log(y); // {y: 100}
({ x: z = { y: x } } = o);
console.log(z); // {y: 42}

console.log(x, y, z); // 300 100 42

// - вложенное деструктурирующее присваивание -
// --- example-1 ---
var a1 = [1, [2, 3, 4], 5];
var o1 = { x: { y: { z: 6 } } };

var [a, [b, c, d], e] = a1;
var {
    x: {
        y: { z: w },
    },
} = o1;

console.log(a, b, c, d, e); // 1 2 3 4 5
console.log(w); // 6

// --- example-2 ---
// сведение воедино пространств имен объектов
var App = {
    model: {
        User: function () {},
    },
};

// вместо:
// var User = App.model.User;

var {
    model: { User },
} = App;

// --- parameter destructuring ---
// -1-
function foa([x, y]) {
    console.log(x, y);
}

foa([1, 2]); // 1 2
foa([1]); // 1 undefined
foa([]); // undefined undefined

// -2-
function foo({ x, y }) {
    console.log(x, y);
}

foo({ y: 1, x: 2 }); // 2 1
foo({ y: 3 }); // undefined 3
foo({}); // undefined undefined

// -3-
function f3([x, y, ...z], ...w) {
    console.log(x, y, z, w);
}

f3([]); // undefined undefined [] []
f3([1, 2, 3, 4], 5, 6); // 1 2 [3,4] [5,6]

// -4-
function f4({ x = 10 } = {}, { y } = { y: 10 }) {
    console.log(x, y);
}

f4(); // 10 10
f4(undefined, undefined); // 10 10
f4({}, undefined); // 10 10

f4({}, {}); // 10 undefined
f4(undefined, {}); // 10 undefined

f4({ x: 2 }, { y: 3 }); // 2, 3

// вложенные значения по умолчанию:
// деструктурированные и реструктурированные
var defaults = {
    options: {
        remove: true,
        enable: false,
        instance: {},
    },
    log: {
        warn: true,
        error: true,
    },
};

var config = {
    options: {
        remove: false,
        instance: null,
    },
};

// --- merge 'defaults' to 'config' ---
{
    // destructuring (с присваиваниеми значений по умолчанию)
    let {
        options: {
            remove = defaults.options.remove,
            enable = defaults.options.enable,
            instance = defaults.options.instance,
        } = {},
        log: { warn = defaults.log.warn, error = defaults.log.error } = {},
    } = config;

    // restructuring
    config = {
        options: { remove, enable, instance },
        log: { warn, error },
    };
}

// --- расширение объектных литералов ---
// - краткие и анонимные -
function runSomething(o) {
    var x = Math.random();
    var y = Math.random();

    return o.something(x, y);
}

runSomething({
    something: function something(x, y) {
        if (x > y) {
            return something(y, x);
        }

        return y - x;
    },
});

// - методы чтения/записи из ES5 -
var obj = {
    _id: 10,
    get id() {
        return this._id++;
    },
    set id(v) {
        this._id = v;
    },
};

console.log(obj.id); // 10
console.log(obj.id); // 11
obj.id = 20;
console.log(obj.id); // 20

// ...u
console.log(obj._id); // 21
console.log(obj._id); // 21 - still !

// --- имена вычисляемых свойств ---
// -1-
var prefix = 'user_';

var ob = {
    baz: function () {},
    [prefix + 'foo']: function () {},
    [prefix + 'bar']: function () {},
};

// -2-
var ob1 = {
    ['f' + 'oo']() {}, // вычисляемый краткий метод
    *['b' + 'ar']() {}, // вычесляемый краткий генератор
};

// --- tagged string literals ---
// -1-
function foo1(strings, ...values) {
    console.log(strings);
    console.log(values);
}

var desc1 = 'awesome';

foo1`Everything is ${desc1}!`;
// ['Everything is', '!']
// ['awesome']

// -2-
function tag(strings, ...values) {
    return strings.reduce(function (s, v, idx) {
        return s + (idx > 0 ? values[idx - 1] : '') + v;
    }, '');
}

var desc = 'awesome';

var text = tag`Everything is ${desc}!`;

console.log(text); // Everything is awesome!

// -3-
function dollabillsyall(strings, ...values) {
    return strings.reduce(function (s, v, idx) {
        if (idx > 0) {
            if (typeof values[idx - 1] == 'number') {
                // смотрите, здесь также используются
                // интерполированные строковые литералы!
                s += `$${values[idx - 1].toFixed(2)}`;
            } else {
                s += values[idx - 1];
            }
        }

        return s + v;
    }, '');
}

var amt1 = 11.99,
    amt2 = amt1 * 1.08,
    buyerName = 'Almaz';

var text1 = dollabillsyall`Спасибо за покупку, ${buyerName}! Выбранный вами 
продукт стоил ${amt1}, что вместе с НДС 
составляет ${amt2}.`;

console.log(text1);
// Спасибо за покупку, Almaz! Выбранный вами
// продукт стоил $11.99, что вместе с НДС
// составляет $12.95

// --- arrow function ------------------
var controller = {
    makeRequest: function () {
        console.log(arguments);
        this.helper();
    },
    helper: () => {
        console.log('work');
    },
};

controller.makeRequest();
