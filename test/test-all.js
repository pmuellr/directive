//-----------------------------------------------------------------------------
// test suite name
//-----------------------------------------------------------------------------
exports.name = "test-all"

exports.testSuiteParms = require("./test-parms")

//-----------------------------------------------------------------------------
// main entry point
//-----------------------------------------------------------------------------

if (!this.console) {
    sys = require("sys")
    console = {log: sys.puts}
}

tester = require("./mini-test")

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
