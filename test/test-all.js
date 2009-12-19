//-----------------------------------------------------------------------------
// test suite name
//-----------------------------------------------------------------------------
exports.name = "test-all"

exports.testSuiteParms = require("./test-parms")

//-----------------------------------------------------------------------------
// main entry point
//-----------------------------------------------------------------------------

// get a console.log defined
try {
    if (console.log) {}
}
catch (e) {
    sys = require("sys")
    console = {log: sys.puts}
}

tester = require("./mini-test")

var results = exports.results = tester.run(exports, console)

console.log("")
console.log("test results")
console.log("============================================")

console.log("")
console.log("passed:")
console.log("--------------------------------------------")
results.passed.forEach(function(result) {
    console.log("   " + result.suiteName + ":" + result.funcName)
})
if (!results.passed.length) console.log("   none")

console.log("")
console.log("failed:")
console.log("--------------------------------------------")
results.failed.forEach(function(result) {
    console.log("   " + result.suiteName + ":" + result.funcName + ": " + result.message)
})
if (!results.failed.length) console.log("   none")

console.log("")
console.log("errored:")
console.log("--------------------------------------------")
results.errored.forEach(function(result) {
    console.log("   " + result.suiteName + ":" + result.funcName + ": " + result.error + ": " + result.message)
})
if (!results.errored.length) console.log("   none")
