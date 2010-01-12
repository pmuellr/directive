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
exports.name = "test-parms"

//-----------------------------------------------------------------------------
exports.testConstructorNullParms = function() {
    try {
        var dr = new DirectiveReader(null)
        assert.fail("should have thrown an error for a null source")
    }
    catch (e) {
    }
    
    try {
        var dr = new DirectiveReader("", null)
        assert.fail("should have thrown an error for a null fileName")
    }
    catch (e) {
    }
    
    try {
        var dr = new DirectiveReader("", "", null)
        assert.fail("should have thrown an error for a null lineNo")
    }
    catch (e) {
    }
    
}

//-----------------------------------------------------------------------------
exports.testNullHandler = function() {
    var dr = new DirectiveReader("source", "fileName", 1)
    
    try {
        dr.process(null)
        assert.fail("should have thrown an error for a null handler")
    }
    catch (e) {
    }
}

//-----------------------------------------------------------------------------
exports.testNoHandlerProcessDirective = function() {
    var dr = new DirectiveReader("source", "fileName", 1)
    
    handler = {
        fileBegin: function() {},
        fileEnd: function() {},
    }
    
    try {
        dr.process(null)
        assert.fail("should have thrown an error for a handler wth no processDirective")
    }
    catch (e) {
    }
}

//-----------------------------------------------------------------------------
exports.testNoHandlerFileBegin = function() {
    var dr = new DirectiveReader("source", "fileName", 1)
    
    handler = {
        processDirective: function() {},
        fileEnd: function() {},
    }

    try {
        dr.process(null)
        assert.fail("should have thrown an error for a handler wth no fileBegin")
    }
    catch (e) {
    }
}

//-----------------------------------------------------------------------------
exports.testNoHandlerFileEnd = function() {
    var dr = new DirectiveReader("source", "fileName", 1)
    
    handler = {
        processDirective: function() {},
        fileBegin: function() {},
    }

    try {
        dr.process(null)
        assert.fail("should have thrown an error for a handler wth no fileEnd")
    }
    catch (e) {
    }
}
