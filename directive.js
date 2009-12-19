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
    handler.fileBegin({
        event:    "fileBegin",
        fileName: this.fileName,
        lineNo:   this.lineNo
    })

    // setup the fileEnd handler argument
    var fileEndArgument = {
        event:    "fileEnd",
        fileName: this.fileName,
    }
    
    // process the source
    try {
        this._process(handler)
    }
    catch (e) {
        fileEndArgument.exception = e
    }

    // call the fileEnd handler
    handler.fileEnd(fileEndArgument)
}

//----------------------------------------------------------------------------
DirectiveReader.prototype._process = function _process(handler) {
    var inComment = false
    var inBody    = false

    this._initDirectiveEvent()    
    
    patternComment   = /^[\/#].*/
    patternDirective = /^[^\/#].*/
    this.localLineNo = 0
    
    this.lines.forEach(function processLine(line) {
        this.localLineNo++
        var matchComment   = patternComment.exec(line)
        var matchDirective = patternDirective.exec(line)
        
        // already in a comment
        if (inComment) {
            if (matchDirective) {
                inComment = false
                this._handleDirective(line)
            }
            else {
                this._addComment(line)
            }
            
            continue
        }
        
        // already in a body
        if (inBody) {
            if (matchDirective) {
                inBody = false
                this._handleDirective(line)
            }
            else {
                this._addBody(line)
            }
            
            continue
        }
        
        if (matchComment) {
            inComment = true
            this._addComment(line)
            continue
        }
        
        if (matchDirective) {
            inBody = true
            this._handleDirective(line)
            continue
        }

        throw new Error("syntax error: unable to handle line: '" + line + "'")        
    })
}

//----------------------------------------------------------------------------
DirectiveReader.prototype._handleDirective = function _handleDirective(line) {
    this.directiveEvent.lineNo = this.lineNo + this.localLineNo
    this.directiveEvent.directive.line = line
    
    // get directive name
    
    // invoke handler
    
    this._initDirectiveEvent()
}

//----------------------------------------------------------------------------
DirectiveReader.prototype._addComment = function _addComment(line) {
    this.directiveEvent.directive.comments.push(line)
}

//----------------------------------------------------------------------------
DirectiveReader.prototype._addBody = function _addBody(line) {
    this.directiveEvent.directive.body.push(line)
}

//----------------------------------------------------------------------------
DirectiveReader.prototype._initDirective = function _initDirectiveEvent() {
    this.directiveEvent = {
        event:    "directive",
        fileName: this.fileName,
        lineNo:   null,
        directive: {
            line: null,
            comment: [],
            body: []
        }
    }
}