// pre-reqs
var assert = require("./mini-test").assert
var DirectiveReader = require("../directive").DirectiveReader

// suite name
exports.name = "test-files"

// are we running in a browser?
var inBrowser
try {
    if (window.console.log) {}
    inBrowser = true
}
catch (e) {
    inBrowser = false
}

// define a readFile function
var readFile
if (inBrowser) {
    var readFile = function(fileName) {
        var xhr = new XMLHttpRequest()
        xhr.open("GET", fileName, false)
        xhr.send()
        return xhr.responseText
    }
}

else {
    var posix = require("posix")
    var readFile = function(fileName) {
        return posix.cat(fileName).wait()
    }
}

// files being tested
var files = [
    "blankLines",
    "justAComment"
]

files.forEach(function(fileName) {
    exports["test_" + fileName] = function() {
        testFile(fileName)
    }
})

//-----------------------------------------------------------------------------
function testFile(fileName) {
    fileName = "test-files/" + fileName + ".txt"
    contents = readFile(fileName)
    assert.isTrue(contents != "")
}