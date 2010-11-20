//----------------------------------------------------------------------------
// Copyright (c) 2010 Patrick Mueller
// 
// The MIT License - see: http://www.opensource.org/licenses/mit-license.php
//----------------------------------------------------------------------------

//----------------------------------------------------------------------------
// constructor
//----------------------------------------------------------------------------
var DirectiveReader = exports.DirectiveReader = function DirectiveReader(source, fileName, lineNo) {
    
    if ((source !== "") && !source) throw new Error("source parameter is invalid")
    if (!fileName) fileName = "unknown"
    if (!lineNo) lineNo = 1
    
    this.source   = source
    this.fileName = fileName || "unknown"
    this.lineNo   = lineNo || 1
}

//----------------------------------------------------------------------------
// pretty print object representation
//----------------------------------------------------------------------------
DirectiveReader.prototype.toString = function toString() {
    return "DirectiveReader[" + this.fileName + ": " + this.lineNo + "]"
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
    checkMethods.split(" ").forEach(function(method) {
        if (typeof handler[method] != "function") {
            throw new Error(thisMethod + ": handler does not support the " + method + "() method")
        }
    })
    
    // prep stuff
    this.lines = this.source.split("\n")
    this.currLineNo = 0

    // build table of specific directive handlers
    this.directiveProcessors = {}
    for (var method in handler) {
        if (typeof handler[method] != "function") continue
        
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
        if (e.name == "DirectiveSyntaxError") {
            processingError = { message: e.message }
        }
        else {
            throw e
        }
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
    var inComment = true
    var inBody    = false

    var patternComment   = /^[\/#].*/
    var patternDirective = /^([\w\$@]+)\s*(.*)\s*/
    var patternBody      = /^\s+.*/
    
    this._initDirective()
    
    for (var i=0; i<this.lines.length; i++) {
        var line = this.lines[i]

        var matchComment   = patternComment.exec(line)
        var matchDirective = patternDirective.exec(line)
        
        var isBlank = ("" == line.replace(/\s*(\S*)\s*/g, "$1"))
        
        // already in a comment
        if (inComment) {
            if (isBlank) {
                this._addComment(line)
                continue
            }
            
            if (matchDirective) {
                inBody    = true
                inComment = false
                this._setDirective(matchDirective[1], matchDirective[2], this.lineNo + i)
            }
            else {
                this._addComment(line)
            }
            
            continue
        }
        
        // already in a body
        if (inBody) {
            if (isBlank) {
                this._addBody(line)
                continue
            }
            
            if (matchDirective) {
                this._handleDirective(handler)
                this._setDirective(matchDirective[1], matchDirective[2], this.lineNo + i)
            }
            else if (matchComment) {
                inBody    = false
                inComment = true
                this._handleDirective(handler)
                this._addComment(line)
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
            this._setDirective(matchDirective[1], matchDirective[2], this.lineNo + i)
            continue
        }

        if (isBlank) continue
        
        throw {
            name:    "DirectiveSyntaxError",
            message: "unable to handle content on line " + (this.lineNo + i) + ": '" + line + "'"
        }
    }
    
    if (this.currentDirective.name) {
        this._handleDirective(handler)
    }
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
        comments:  [],
        body:      []
    }
}