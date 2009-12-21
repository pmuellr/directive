//-----------------------------------------------------------------------------
// define console.log
//-----------------------------------------------------------------------------
try {
    if (console.log) {}
}
catch (e) {
    sys = require("sys")
    console = {log: sys.puts}
}

//-----------------------------------------------------------------------------
// test suite name
//-----------------------------------------------------------------------------
exports.name = "test-all"

//-----------------------------------------------------------------------------
// test suite set up
//-----------------------------------------------------------------------------
exports.suiteSetUp = function() {
    console.log("in " + exports.name + ":suiteSetUp()")
}

//-----------------------------------------------------------------------------
// test suite tear down
//-----------------------------------------------------------------------------
exports.suiteTearDown = function() {
    console.log("in " + exports.name + ":suiteTearDown()")
}

//-----------------------------------------------------------------------------
// test set up
//-----------------------------------------------------------------------------
exports.setUp = function() {
    console.log("in " + exports.name + ":setUp()")
}

//-----------------------------------------------------------------------------
// test tear down
//-----------------------------------------------------------------------------
exports.tearDown = function() {
    console.log("in " + exports.name + ":tearDown()")
}

//-----------------------------------------------------------------------------
// a test 
//-----------------------------------------------------------------------------
exports.testSomething = function() {
    console.log("in " + exports.name + ":testSomething()")
//    assert.fail("something failed")    
//    throw new Error("something errored")
}

//-----------------------------------------------------------------------------
// a sub-suite
//-----------------------------------------------------------------------------
exports.testSuiteAnother = {
    name: "testSuiteAnother",
    testAnother: function() {}
}

//-----------------------------------------------------------------------------
// main entry point
//-----------------------------------------------------------------------------
tester = require("./mini-test")
assert = tester.assert

var results = tester.run(exports, console)

console.log("")
console.log("test results")

console.log("")
console.log("passed:")
results.passed.forEach(function(result) {
    console.log("   " + result.suiteName + ":" + result.funcName)
})

console.log("")
console.log("failed:")
results.failed.forEach(function(result) {
    console.log("   " + result.suiteName + ":" + result.funcName + ": " + result.message)
})

console.log("")
console.log("errored:")
results.errored.forEach(function(result) {
    console.log("   " + result.suiteName + ":" + result.funcName + ": " + result.error + ": " + result.message)
})
