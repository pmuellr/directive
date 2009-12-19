var assert = require("./mini-test").assert
var DirectiveReader = require("../directive").DirectiveReader

//-----------------------------------------------------------------------------
// test suite name
//-----------------------------------------------------------------------------
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
