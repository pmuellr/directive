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

// pre-reqs
var platform = require("./platform")
var assert = require("./mini-test").assert
var DirectiveReader = require("../directive").DirectiveReader

// suite name
exports.name = "test-files"

// files being tested
var files = [
    "blankLines",
    "justAComment",
    "justADirective"
]

files.forEach(function(fileName) {
    exports["test_" + fileName] = function() {
        testFile(fileName)
    }
})

//-----------------------------------------------------------------------------
function generateTestFileFunction(fileName) {
    return testFile(fileName)
}

//-----------------------------------------------------------------------------
function testFile(fileName) {
    var fileName = "test-files/" + fileName + ".txt"
    var contents = platform.readFile(fileName)
    assert.isTrue(contents != "")
    
    var parts  = contents.split(/^EOF$/m, 2)
    var input  = parts[0]
    var output = parts[1]
    
    if (output === undefined) {
        assert.fail("no EOF found in input file: " + fileName)
    }
    
    if ("" == output.replace(/\s*(\S*)\s*/g, "$1")) {
        assert.fail("output section empty: " + fileName)
    }
    
    var dr = new DirectiveReader(input, fileName, 1)
    var events = []
    
    var handler = {}
    handler.processDirective = function(event) { events.push(event) }
    handler.fileBegin        = handler.processDirective
    handler.fileEnd          = handler.processDirective
    
    dr.process(handler)
    
    var expected = JSON.parse(output)
    expected     = JSON.stringify(expected)
    var actual   = JSON.stringify(events)
    
    assert.equal(expected, actual)
}

//-----------------------------------------------------------------------------
function sameStructure(x, y) {
    return hasSameProperties(x,y) && hasSameProperties(y,x)
}

//-----------------------------------------------------------------------------
function hasSameProperties(x, y, keyList, objectsSeen) {
    if (!keyList) keyList = []
    if (!objectsSeen) objectsSeen = []
    
    if ((x.length != null) && (y.length != null)) {
        if (x.length != y.length) return false
    }
    
    for (var key in x) {
        var vx = x[key]
        var vy = y[key]
        
        var tvx = typeof vx
        var tvy = typeof vy
        
        if (tvx != tvy) return false
        
        if (tvx != "object") {
            if (vx != vy) return false
        }
        
        else {
            if (objectsSeen.indexOf(vx) != -1) continue

            keyList.push(key)
            objectsSeen.push(vx)
            
            if (!hasSameProperties(vx, vy, keyList, objectsSeen)) {
                return false
            }
            
            keyList.pop()
        }
    }
    
    return true
}
