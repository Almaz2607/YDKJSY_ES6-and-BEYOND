// --- with callback ---------
function ajax(url, cb) {
    // делаем запрос, в конечном счете вызываем 'cb(..)'
}

// ..

ajax('hppt://some.url.1', function handler(err, contents) {
    if (err) {
        // обрабатываем ошибку ajax
    } else {
        // обрабатываем удачное завершение 'contents'
    }
});

// --- with promise ----------
function ajax(url) {
    return new Promise(function (resolve, reject) {
        // делаем запрос, в конечном счете вызываем
        // or 'resolve(..)', or 'reject(..)'
    });
}

// ..
// --- example-1 ---
ajax('http://some.url.1').then(
    function fulfilled(contents) {
        // обрабатываем успешное завершение 'contents'
    },
    function rejected(reason) {
        // обрабатываем причину ошибки ajax
    }
);

// --- example-2 ---
ajax('http://some.url.1')
    .then(
        function fulfilled(contents) {
            return contents.toUpperCase();
        },
        function rejected(reason) {
            return 'Default Value';
        }
    )
    .then(function fulfilled(data) {
        // обрабатываем данные от исходных обработчиков обещания
    });

// --- example-3 ---
ajax('http://some.url.1')
    .then(
        function fulfilled(contents) {
            return ajax('http://some.url.2?v=' + contents);
        },
        function rejected(reason) {
            return ajax('http://backup.url.3?err=' + reason);
        }
    )
    .then(function fulfilled(contents) {
        // 'contents' берется из следующего вызова
        // 'ajax(..)', каким бы он ни был
    });

// --- API promise -----
// --- example-1 ---
var p1 = Promise.resolve(42);
var p2 = new Promise(function pr(resolve) {
    resolve(42);
});

// --- example-2 ---
var theP = ajax();

var pr1 = Promise.resolve(theP);
var pr2 = new Promise(function pr(resolve) {
    resolve(theP);
});

var p3 = Promise.reject('Oops');
var p4 = new Promise(function pr(resolve, reject) {
    reject('Oops');
});
