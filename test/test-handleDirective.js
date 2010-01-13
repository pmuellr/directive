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
var assert = require("./mini-test").assert
var DirectiveReader = require("../directive").DirectiveReader

// suite name
exports.name = "test-handleDirective"

//-----------------------------------------------------------------------------
exports.testHandleDirective = function() {
    var file = "directive1: some data\ndirective2: some more data"
    var dr = new DirectiveReader(file)

    var called_processDirective           = false
    var called_fileEnd                    = false
    var called_fileBegin                  = false
    var called_handleDirective_directive1 = false
    var called_handleDirective_directive2 = false
    
    var handler = {
        processDirective: function() {
            throw new Error()
            called_processDirective = true
        },
        
        fileEnd: function() {
            called_fileEnd = true
        },
        
        fileBegin: function() {
            called_fileBegin = true
        },
        
        handleDirective_directive1: function() {
            called_handleDirective_directive1 = true
        },
        
        handleDirective_directive2: function() {
            called_handleDirective_directive2 = true
        }
    }

    dr.process(handler)
    
    assert.isFalse(called_processDirective, "should not have called processDirective")
    assert.isTrue(called_fileEnd, "should have called fileEnd")
    assert.isTrue(called_fileBegin, "should have called fileBegin")
    assert.isTrue(called_handleDirective_directive1, "should have called handleDirective_directive1")
    assert.isTrue(called_handleDirective_directive2, "should have called handleDirective_directive2")
}

