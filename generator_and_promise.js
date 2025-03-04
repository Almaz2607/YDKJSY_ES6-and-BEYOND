// --- mamagment of asycn operations ---
// ---- a chain of promises ------
step1()
    .then(step2, step2Failed)
    .then(function (msg) {
        Promise.all([step3a(msg), step3b(msg), step3c(msg)]);
    })
    .then(step4);

// ---- with generators ------
function* main() {
    var ret = yield step1();

    try {
        ret = yield step2(ret);
    } catch (err) {
        ret = yield step2Failed(err);
    }

    ret = yield Promise.all([step3a(ret), step3b(ret), step3c(ret)]);

    yield step4(ret);
}

// --- code of launch --------
function run(gen) {
    var args = [].slice.call(arguments, 1),
        it;

    it = gen.apply(this, args);

    return Promise.resolve().then(function handleNext(value) {
        var next = it.next(value);

        return (function handleResult(next) {
            if (next.done) {
                return next.value;
            } else {
                return Promise.resolve(next.value).then(
                    handleNext,
                    function handleError(err) {
                        return Promise.resolve(it.throw(err)).then(
                            handleResult
                        );
                    }
                );
            }
        })(next);
    });
}

run(main).then(
    function fulfilled() {
        // '*main()' is successfully completed
    },
    function rejected(reason) {
        // Oops, something went wrong
    }
);
