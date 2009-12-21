//----------------------------------------------------------------------------
// The MIT License
// 
// Copyright (c) 2009 Patrick Mueller
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
//----------------------------------------------------------------------------

//----------------------------------------------------------------------------
// constructor
//----------------------------------------------------------------------------
var DirectiveReader = exports.DirectiveReader = function DirectiveReader(source, fileName, lineNo) {

    if (!source) throw new Error("source parameter is invalid")
    if (!fileName) throw new Error("fileName parameter is invalid")
    if (!lineNo) throw new Error("lineNo parameter is invalid")
    
    this.source   = source
    this.fileName = fileName
    this.lineNo   = lineNo
}

//----------------------------------------------------------------------------
// process a DirectiveReader
//----------------------------------------------------------------------------
DirectiveReader.prototype.process = function process(handler) {
    var thisMethod = "DirectiveReader.process"

    // have we already been processed?
    if (this.processed) throw new Error(thisMethod + ": this reader has already been processed")
    this.processed = true
    
    // sanity check the handler
    if (!handler) throw new Error(thisMethod + ": argument was null")
    
    var checkMethods = "processDirective fileBegin fileEnd"
    checkMethods.split().forEach(function(method) {
        if (typeof handler[method] != "function") {
            throw new Error(thisMethod + ": handler does not support the " + method + "() method")
        }
    })
    
    // prep stuff
    this.lines = source.split("\n")
    this.currLineNo = 0

    // build table of specific directive handlers
    this.directiveProcessors = {}
    for (var method in handler) {
        if (typeof method != "function") continue
        
        var match = method.match("^handleDirective_(.*)")
        if (!match) continue
        
        this.directiveProcessors[match[1]] = handler["handleDirective_" + match[1]]
    }

    // call the fileBegin handler
    handler.fileBegin.call(handler, {
        event:    "fileBegin",
        fileName: this.fileName
    })

    var processingError
    
    // process the source
    try {
        this._process(handler)
    }
    catch (e) {
        processingError = e
    }

    // call the fileEnd handler
    handler.fileEnd.call(handler, {
        event:    "fileEnd",
        fileName: this.fileName,
        error:    processingError
    })
}

//----------------------------------------------------------------------------
DirectiveReader.prototype._process = function _process(handler) {
    var inComment = false
    var inBody    = false

    var patternComment   = /^[\/#].*/
    var patternDirective = /^[\w\$@]+\s*(.*)\s*/
    var patternBody      = /^\s+.*/
    
    this._initDirective()
    
    var localLineNo = 0
    this.lines.forEach(function processLine(line) {
        localLineNo++
        
        var matchComment   = patternComment.exec(line)
        var matchDirective = patternDirective.exec(line)
        
        // already in a comment
        if (inComment) {
            if (matchDirective) {
                inComment = false
                this._setDirective(matchDirective[1], matchDirective[2], this.lineNo + localLineNo)
            }
            else {
                this._addComment(line)
            }
            
            continue
        }
        
        // already in a body
        if (inBody) {
            if (matchDirective) {
                this._handleDirective()
                this._setDirective(matchDirective[1], matchDirective[2], this.lineNo + localLineNo)
            }
            else if (matchComment) {
                inBody    = false
                inComment = true
                this._handleDirective()
                this._addComment(line)
            }
            else {
                this._addBody(line)
            }
            
            continue
        }

        //        
        if (matchComment) {
            inComment = true
            this._addComment(line)
            continue
        }
        
        if (matchDirective) {
            inBody = true
            this._setDirective(matchDirective[1], matchDirective[2], this.lineNo + localLineNo)
            continue
        }

        throw new Error("syntax error: unable to handle line: '" + line + "'")        
    })
}

//----------------------------------------------------------------------------
DirectiveReader.prototype._handleDirective = function _handleDirective(handler) {
    var eventData = {
        event:     "processDirective",
        fileName:  this.fileName,
        directive: this.currentDirective
    }

    var directiveName = this.currentDirective.name
    
    if (this.directiveProcessors[directiveName]) {
        this.directiveProcessors[directiveName].call(handler, eventData)
    }
    else {
        handler.processDirective.call(handler, eventData)
    }

    this._initDirective()
}

//----------------------------------------------------------------------------
DirectiveReader.prototype._currentDirective = function _currentDirective() {
    return this.currentDirective
}

//----------------------------------------------------------------------------
DirectiveReader.prototype._setDirective = function _setDirective(name, args, lineNo) {
    this.currentDirective.name   = name
    this.currentDirective.args   = args
    this.currentDirective.lineNo = lineNo
}

//----------------------------------------------------------------------------
DirectiveReader.prototype._addComment = function _addComment(line) {
    this.currentDirective.comments.push(line)
}

//----------------------------------------------------------------------------
DirectiveReader.prototype._addBody = function _addBody(line) {
    this.currentDirective.body.push(line)
}

//----------------------------------------------------------------------------
DirectiveReader.prototype._initDirective = function _initDirective() {
    this.currentDirective = {
        name:      null,
        args:      null,
        lineNo:    null,
        comment:   [],
        body:      []
    }
}