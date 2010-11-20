#!/usr/bin/env node

//-----------------------------------------------------------------------------
// The MIT License
// 
// Copyright (c) 2010 Patrick Mueller
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//-----------------------------------------------------------------------------

var platform = require("./platform")
log = platform.log

// get the testing framework
tester = require("./mini-test")

// set the test name
exports.name = "test-all"

// set the suites to run
exports.testSuiteParms           = require("./test-parms")
exports.testSuiteFiles           = require("./test-files")
exports.testSuiteHandleDirective = require("./test-handleDirective")

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
