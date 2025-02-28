'use strict';
// --- Class  --------------
class Foo {
    constructor(a, b) {
        this.x = a;
        this.y = b;
    }

    gimmeXY() {
        return this.x * this.y;
    }
}

var f = new Foo(5, 15);

console.log(f.x); // 5
console.log(f.y); // 15
console.log(f.gimmeXY()); // 75

// - keywords 'super' & 'extends' ---
// -1-
class Bar extends Foo {
    constructor(a, b, c) {
        super(a, b);
        this.z = c;
    }

    gimmeXYZ() {
        return super.gimmeXY() * this.z;
    }
}

var b = new Bar(5, 15, 25);

console.log(b.x); // 5
console.log(b.y); // 15
console.log(b.z); // 25
console.log(b.gimmeXYZ()); // 1875

// -2-
class ParentA {
    constructor() {
        this.id = 'a';
    }
    foo() {
        console.log('ParentA:', this.id);
    }
}

class ParentB {
    constructor() {
        this.id = 'b';
    }
    foo() {
        console.log('ParentB:', this.id);
    }
}

class ChildA extends ParentA {
    foo() {
        super.foo();
        console.log('ChildA:', this.id);
    }
}

class ChildB extends ParentB {
    foo() {
        super.foo();
        console.log('ChildB:', this.id);
    }
}

var a = new ChildA();
a.foo(); // ParentA: a
// ChildA a

var b = new ChildB();
b.foo(); // ParentB: b
// ChildB b

b.foo.call(a); // ParentB: a
// ChildB a

// -3-
// --- before ES6 ---
function Fow() {
    this.a = 1;
}

function Baw() {
    this.b = 2;
    Fow.call(this);
}
// 'Baw' "extends" 'Fow'
Baw.prototype = Object.create(Fow.prototype);

// --- ES6 ---
class Foq {
    constructor() {
        this.a = 1;
    }
}

class Baz extends Foq {
    constructor() {
        super();
        this.b = 2; // недопустимо до вызова 'super()'
    }
}

// --- extending built-in objects ---------
class MyCoolArray extends Array {
    first() {
        return this[0];
    }
    last() {
        return this[this.length - 1];
    }
}

var arr = new MyCoolArray(1, 2, 3);

console.log(arr.length); // 3
console.log(arr); // [1, 2, 3]

console.log(arr.first()); // 1
console.log(arr.last()); // 3

// --- property new.target -------------
class Foe {
    constructor() {
        console.log('Foe: ', new.target.name);
    }
}

class Bae extends Foe {
    constructor() {
        super();
        console.log('Bae: ', new.target.name);
    }
    bae() {
        console.log('bae: ', new.target);
    }
}

var a1 = new Foe(); // Foe: Foe

var b1 = new Bae(); // Foo: Bae <-- учитывает сторону, вызвавшую 'new'
// Bae: Bae

b1.bae(); // bae: undefined

// --- keywords 'static' ----------
class Fos {
    static cool() {
        console.log('cool');
    }
    wow() {
        console.log('wow');
    }
}

class Bas extends Fos {
    static awesome() {
        super.cool();
        console.log('awesome');
    }
    neat() {
        super.wow();
        console.log('neat');
    }
}

Fos.cool(); // cool
Bas.cool(); // cool
Bas.awesome(); // cool
// awesome

var s = new Bas();

s.neat(); // wow
// neat
console.log(s.awesome); // undefined
console.log(s.cool); // undefined

// --- property 'Symbol.species' ---
// -1-
class MyCoolArray2 extends Array {
    // принудительно превращаем 'species' в
    // родительский конструктор
    static get [Symbol.species]() {
        return Array;
    }
}

var a2 = new MyCoolArray2(1, 2, 3);

var b2 = a2.map(function (v) {
    return v * 2;
});

console.log(b2 instanceof MyCoolArray2); // false
console.log(b2 instanceof Array); // true

// -2-
class Foc {
    // передаем 'species' производному конструктору
    static get [Symbol.species]() {
        return this;
    }

    spawn() {
        return new this.constructor[Symbol.species]();
    }
}

class Bac extends Foc {
    // принудительно превращаем 'species' в
    // родительский конструктор
    static get [Symbol.species]() {
        return Foc;
    }
}

var a3 = new Foc();
var b3 = a3.spawn();
console.log(b3 instanceof Foc); // true

var x = new Bac();
var y = x.spawn();
console.log(y instanceof Bac); // false
console.log(y instanceof Foc); // true
