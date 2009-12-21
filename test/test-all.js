// are we running in a browser?
var inBrowser
try {
    if (window.console.log) {}
    inBrowser = true
}
catch (e) {
    inBrowser = false
}

// platform specific functions
if (inBrowser) {
    function log(message) { console.log(message) }
}

else {
    sys = require("sys")
    log = sys.puts
}

// get the testing framework
tester = require("./mini-test")

// set the test name
exports.name = "test-all"

// set the suites to run
exports.testSuiteParms = require("./test-parms")
exports.testSuiteFiles = require("./test-files")

// run the tests
var results = exports.results = tester.run(exports, log)

log("")
log("test results")
log("============================================")

log("")
log("passed:")
log("--------------------------------------------")
results.passed.forEach(function(result) {
    log("   " + result.suiteName + ":" + result.funcName)
})
if (!results.passed.length) log("   none")

log("")
log("failed:")
log("--------------------------------------------")
results.failed.forEach(function(result) {
    log("   " + result.suiteName + ":" + result.funcName + ": " + result.message)
})
if (!results.failed.length) log("   none")

log("")
log("errored:")
log("--------------------------------------------")
results.errored.forEach(function(result) {
    log("   " + result.suiteName + ":" + result.funcName + ": " + result.error + ": " + result.message)
})
if (!results.errored.length) log("   none")
